/**
 * Original source: https://github.com/ClickHouse/clickhouse-js/blob/main/src/connection/adapter/http_search_params.ts
 */

import type { ClickHouseSettings } from '@clickhouse/client';

import { formatQueryParams } from './format-query-params.ts';
import { formatQuerySettings } from './format-query-settings.ts';

type ToSearchParamsOptions = {
  database?: string;
  clickhouse_settings?: ClickHouseSettings;
  query_params?: Record<string, unknown>;
  query?: string;
  session_id?: string;
  query_id?: string;
};

export function addSearchParams(
  params: URLSearchParams,
  { database, query, query_params, clickhouse_settings, session_id, query_id }: ToSearchParamsOptions,
): URLSearchParams | undefined {
  if (
    clickhouse_settings === undefined &&
    query_params === undefined &&
    query === undefined &&
    database === 'default'
  ) {
    return;
  }

  if (query_params !== undefined) {
    for (const [key, value] of Object.entries(query_params)) {
      params.set(`param_${key}`, formatQueryParams(value));
    }
  }

  if (clickhouse_settings !== undefined) {
    for (const [key, value] of Object.entries(clickhouse_settings)) {
      if (value !== undefined) {
        params.set(key, formatQuerySettings(value as any));
      }
    }
  }

  if (database && database !== 'default') {
    params.set('database', database);
  }

  if (query) {
    params.set('query', query);
  }

  if (session_id) {
    params.set('session_id', session_id);
  }

  if (query_id) {
    params.set('query_id', query_id);
  }

  return params;
}
