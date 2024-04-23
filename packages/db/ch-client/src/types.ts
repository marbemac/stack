import type { ClickHouseSettings } from '@clickhouse/client';

export interface CreateClientOpts {
  /**
   * Clickhouse URI in the form http(s)://{username}:{password}@{host}:{port}/{db}
   */
  uri: string;

  applicationName: string;

  /**
   * Creates a client that does not operate on a specific database by default (even if provided in the uri)
   *
   * Mostly useful for admin commands (such as migrations, dropping and re-creating a database, etc)
   */
  noDatabase?: boolean;

  /** The request timeout in milliseconds.
   *  @default 30_000 */
  requestTimeout?: number;

  // Optional extra session identifier
  sessionId?: string;

  keep_alive?: {
    /** Enable or disable HTTP Keep-Alive mechanism.
     *  @default true */
    enabled?: boolean;
  };

  clickhouse_settings?: ClickHouseSettings;

  compression?: {
    /**
     * Compress query response bodies?
     *
     * @default true
     */
    response?: boolean;

    /**
     * Compress insert request bodies?
     *
     * NOTE: Not supported in edge client yet.
     *
     * @default false
     */
    request?: boolean;
  };
}

export interface BaseParams {
  /** Parameters for query binding. https://clickhouse.com/docs/en/interfaces/http/#cli-queries-with-parameters */
  query_params?: Record<string, unknown>;

  /** A specific `query_id` that will be sent with this request.
   * If it is not set, a random identifier will be generated automatically by the client. */
  query_id?: string;

  abort_signal?: AbortSignal;
}

export interface ExecParams extends BaseParams {
  /** Statement to execute. */
  query: string;
}

export interface QueryParams<F extends DataFormat = 'JSON'> extends BaseParams {
  /** Statement to execute. */
  query: string;

  /**
   * Format of the resulting dataset.
   *
   * If there is a need to expose more clickhouse formats here, check that the edge client works well with the additional formats.
   */
  format: F;
}

export type InsertValues<T> = readonly T[] | ReadableStream<T>;

export interface InsertParams<T = unknown> extends BaseParams {
  /** Name of a table to insert into. */
  table: string;

  /** A dataset to insert. */
  values: InsertValues<T>;

  /**
   * Format of the dataset to insert.
   *
   * If there is a need to expose more clickhouse formats here, check that the edge client works well with the additional formats.
   */
  format: 'JSONEachRow';
}

export interface JSONResult<T> {
  data: T[];
  statistics: { bytes_read: number; elapsed: number; rows_read: number };
  rows: number;
  meta: { name: string; type: string }[];
}

export interface ResultSet<T, T2 = T> {
  text(): Promise<string>;
  json(): Promise<T>;
  stream(): QueryStream<T2>;
}

export type QueryStream<T> = ReadableStream<ResultSetStreamRow<T>[]>;

export interface ResultSetStreamRow<T> {
  /**
   * A string representation of a row.
   */
  text: string;

  /**
   * Returns a JSON representation of a row.
   * The method will throw if called on a response in JSON incompatible format.
   * It is safe to call this method multiple times.
   */
  json(): T;
}

export interface QueryResult {
  // noop
}

interface InsertResult {
  query_id: string;
}

export type DataFormat = 'JSON' | 'JSONEachRow';

interface QueryFn {
  <T>(params: QueryParams<'JSONEachRow'>): Promise<ResultSet<T[], T>>;
  <T>(params: QueryParams<'JSON'>): Promise<ResultSet<JSONResult<T>>>;
}

export interface ClickHouseClient {
  query: QueryFn;
  exec: (params: ExecParams) => Promise<QueryResult>;
  insert<T>(params: InsertParams<T>): Promise<InsertResult>;
}

export type CreateClientFn = (opts: CreateClientOpts) => ClickHouseClient;
