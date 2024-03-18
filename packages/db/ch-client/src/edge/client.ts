import type { ClickHouseSettings } from '@clickhouse/client';
import { Id } from '@marbemac/utils-ids';
import { isReadableStream } from '@marbemac/utils-streams';

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
import { addSearchParams } from './http-search-params.ts';
import { ResultSet } from './result.ts';

export interface EdgeClickHouseClientConfig {
  /** A ClickHouse instance URL. EG `http://localhost:8123`. */
  host: string;

  username: string;
  password: string;

  /** The name of the application using the client. Default: empty. */
  application?: string;

  /** Database name to use. Default value: `default`. */
  database?: string;

  session_id?: string;

  clickhouse_settings?: ClickHouseSettings;

  compression?: CreateClientOpts['compression'];
}

export class EdgeClickHouseClient implements ClickHouseClient {
  #config: EdgeClickHouseClientConfig;

  constructor(config: EdgeClickHouseClientConfig) {
    this.#config = Object.freeze({ ...config });
  }

  async query(params: QueryParams<DataFormat>) {
    const u = new URL(this.#config.host);
    const format = params.format ?? 'JSON';
    const query_id = this.#getQueryId(params);

    const clickhouse_settings = this.#withHttpSettings(this.#config.clickhouse_settings, this.#shouldCompressResponses);

    addSearchParams(u.searchParams, {
      clickhouse_settings,
      query_params: params.query_params,
      session_id: this.#config.session_id,
      query_id,
    });

    const res = await fetch(u, {
      method: 'POST',
      body: params.query,
      headers: this.#buildHeaders(format, { decompressResponse: this.#shouldCompressResponses }),
    });

    if (!res.ok) {
      throw new Error(`Clickhouse query error [query_id: ${query_id}]: ${(await res.text()) || res.statusText}`);
    }

    if (!res.body) {
      throw new Error(`Clickhouse query has null body [query_id: ${query_id}]`);
    }

    return new ResultSet(res.body as ReadableStream, format, query_id);
  }

  async exec(params: ExecParams) {
    const u = new URL(this.#config.host);

    const query_id = this.#getQueryId(params);

    addSearchParams(u.searchParams, {
      clickhouse_settings: this.#config.clickhouse_settings,
      query_params: params.query_params,
      session_id: this.#config.session_id,
      query_id,
    });

    const req = fetch(u, {
      method: 'POST',
      body: params.query,
      headers: this.#buildHeaders(),
    });

    const res = await req;
    if (!res.ok) {
      console.error(`Clickhouse exec error: ${await res.text()}`, { query_id, query: params.query });
    }

    return req;
  }

  async insert(params: InsertParams) {
    const u = new URL(this.#config.host);
    const format = params.format || 'JSONEachRow';
    const query_id = this.#getQueryId(params);

    const query = `INSERT INTO ${params.table.trim()} FORMAT ${format}`;

    addSearchParams(u.searchParams, {
      clickhouse_settings: this.#config.clickhouse_settings,
      query_params: params.query_params,
      query,
      session_id: this.#config.session_id,
      query_id,
    });

    const encodedBody = encodeValues(params.values, format);

    const isStream = isReadableStream(encodedBody);
    const bodyStream = isStream
      ? encodedBody.pipeThrough(new TextEncoderStream())
      : new Blob([encodedBody], { type: 'text/plain' }).stream();

    const res = await fetch(u, {
      method: 'POST',
      body: bodyStream as ReadableStream,
      headers: this.#buildHeaders(format, { compressRequest: this.#shouldCompressRequests }),
      duplex: 'half',
    });

    if (!res.ok) {
      console.error(`Clickhouse insert error: ${await res.text()}`, { query_id, query });
    }

    return { query_id };
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
