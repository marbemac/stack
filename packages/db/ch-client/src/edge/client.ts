import type { ClickHouseSettings } from '@clickhouse/client';
import { isSuccessfulResponse, parseError } from '@clickhouse/client-common';
import { Id } from '@marbemac/utils-ids';
import { isReadableStream } from '@marbemac/utils-streams';
import type { SetRequired } from '@marbemac/utils-types';

import type {
  BaseParams,
  ClickHouseClient,
  CreateClientOpts,
  DataFormat,
  ExecParams,
  InsertParams,
  QueryParams,
} from '../types.ts';
import { encodeValues } from './encoding.ts';
import { addSearchParams, type ToSearchParamsOptions } from './http-search-params.ts';
import { ResultSet } from './result.ts';
import { getAsText } from './streams.ts';

export interface EdgeClickHouseClientConfig {
  /** A ClickHouse instance URL. EG `http://localhost:8123`. */
  host: string;

  username: string;
  password: string;

  /** The name of the application using the client. Default: empty. */
  application?: string;

  /** Database name to use. Default value: `default`. */
  database?: string;

  /** The request timeout in milliseconds. Default value: `30_000`. */
  request_timeout?: number;

  keep_alive?: {
    /** Enable or disable HTTP Keep-Alive mechanism.
     *  @default true */
    enabled?: boolean;
  };

  session_id?: string;

  clickhouse_settings?: ClickHouseSettings;

  compression?: CreateClientOpts['compression'];
}

export class EdgeClickHouseClient implements ClickHouseClient {
  #config: SetRequired<EdgeClickHouseClientConfig, 'database' | 'request_timeout' | 'keep_alive'>;

  constructor({ database = 'default', request_timeout = 30_000, keep_alive, ...config }: EdgeClickHouseClientConfig) {
    this.#config = Object.freeze({
      database,
      request_timeout,
      keep_alive: { enabled: keep_alive?.enabled ?? true },
      ...config,
    });
  }

  async query(params: QueryParams<DataFormat>) {
    const format = params.format ?? 'JSON';
    const query_id = this.#getQueryId(params);

    const clickhouse_settings = this.#withHttpSettings(this.#config.clickhouse_settings, this.#shouldCompressResponses);

    const res = await this.#request({
      params,
      searchParamOpts: {
        clickhouse_settings,
        query_params: params.query_params,
        query_id,
      },
      req: {
        method: 'POST',
        body: params.query,
        headers: this.#buildHeaders(format, { decompressResponse: this.#shouldCompressResponses }),
      },
    });

    return new ResultSet(res.body as ReadableStream, format, query_id);
  }

  async exec(params: ExecParams) {
    const query_id = this.#getQueryId(params);

    const res = await this.#request({
      params,
      searchParamOpts: {
        query_params: params.query_params,
        query_id,
      },
      req: {
        method: 'POST',
        body: params.query,
        headers: this.#buildHeaders(),
      },
    });

    return {
      stream: (res.body as ReadableStream) || new ReadableStream<Uint8Array>(),
      query_id,
    };
  }

  async insert(params: InsertParams) {
    const format = params.format || 'JSONEachRow';
    const query_id = this.#getQueryId(params);
    const query = `INSERT INTO ${params.table.trim()} FORMAT ${format}`;

    const encodedBody = encodeValues(params.values, format);

    const isStream = isReadableStream(encodedBody);
    const bodyStream = isStream
      ? encodedBody.pipeThrough(new TextEncoderStream())
      : new Blob([encodedBody], { type: 'text/plain' }).stream();

    const res = await this.#request({
      params,
      searchParamOpts: {
        query_params: params.query_params,
        query,
        query_id,
      },
      req: {
        method: 'POST',
        body: bodyStream as ReadableStream,
        headers: this.#buildHeaders(format, { compressRequest: this.#shouldCompressRequests }),
        duplex: 'half',
      },
    });

    if (res.body !== null) {
      await res.text(); // drain the response (it's empty anyway)
    }

    return { query_id };
  }

  async #request({
    params,
    searchParamOpts,
    req,
  }: {
    params: BaseParams;
    searchParamOpts: ToSearchParamsOptions;
    req: RequestInit;
  }) {
    const u = new URL(this.#config.host);

    addSearchParams(u.searchParams, {
      clickhouse_settings: this.#config.clickhouse_settings,
      session_id: this.#config.session_id,
      ...searchParamOpts,
    });

    const abortController = new AbortController();

    let isTimedOut = false;
    const timeout = setTimeout(() => {
      isTimedOut = true;
      abortController.abort();
    }, this.#config.request_timeout);

    let isAborted = false;
    if (params?.abort_signal !== undefined) {
      params.abort_signal.onabort = () => {
        isAborted = true;
        abortController.abort();
      };
    }

    try {
      const res = await fetch(u, {
        keepalive: this.#config.keep_alive.enabled,
        signal: abortController.signal,
        ...req,
      });

      clearTimeout(timeout);

      if (isSuccessfulResponse(res.status)) {
        return res;
      } else {
        return Promise.reject(
          parseError(await getAsText((res.body as ReadableStream) || new ReadableStream<Uint8Array>())),
        );
      }
    } catch (err) {
      clearTimeout(timeout);
      if (isAborted) {
        return Promise.reject(new Error('The user aborted a request.'));
      }
      if (isTimedOut) {
        return Promise.reject(new Error('Timeout error.'));
      }
      if (err instanceof Error) {
        // maybe it's a ClickHouse error
        return Promise.reject(parseError(err));
      }
      // shouldn't happen
      throw err;
    }
  }

  #buildHeaders(
    format?: QueryParams['format'] | InsertParams['format'],
    { decompressResponse, compressRequest }: { decompressResponse?: boolean; compressRequest?: boolean } = {},
  ) {
    const headers: HeadersInit = {
      /**
       * https://github.com/ClickHouse/clickhouse-js/blob/1e152d696b93198a0e24429f36521bca90135e74/src/connection/adapter/base_http_adapter.ts#L104
       */
      'User-Agent': this.#buildUserAgent(),
    };

    if (format) {
      headers['X-ClickHouse-Format'] = format;
    }

    if (this.#config.username) {
      headers['X-ClickHouse-User'] = this.#config.username;
    }

    if (this.#config.password) {
      headers['X-ClickHouse-Key'] = this.#config.password;
    }

    if (this.#config.database) {
      headers['X-ClickHouse-Database'] = this.#config.database;
    }

    if (decompressResponse) {
      headers['Accept-Encoding'] = 'gzip';
    }

    if (compressRequest) {
      headers['Content-Encoding'] = 'gzip';
    }

    return headers;
  }

  #buildUserAgent() {
    let agent = '@marbemac/db-ch-client/edge';

    if (this.#config.application) {
      agent = `${this.#config.application} ${agent}`;
    }

    return agent;
  }

  #getQueryId(params: BaseParams) {
    return params.query_id || Id.generateDbId();
  }

  #withHttpSettings(clickhouse_settings?: ClickHouseSettings, compression?: boolean): ClickHouseSettings {
    return {
      ...(compression
        ? {
            enable_http_compression: 1,
          }
        : {}),
      ...clickhouse_settings,
    };
  }

  get #shouldCompressResponses() {
    return this.#config.compression?.response ?? true;
  }

  get #shouldCompressRequests() {
    // return this.#config.compression?.request ?? true;
    // NOT SUPPORTED YET
    return false;
  }
}
