import { parseDatabaseUrl } from '@marbemac/utils-urls';

import { defaultClickhouseSettings } from '../settings.ts';
import type { CreateClientFn } from '../types.ts';
import { EdgeClickHouseClient } from './client.ts';

export const createClient: CreateClientFn = ({
  uri,
  applicationName,
  noDatabase,
  sessionId,
  clickhouse_settings,
  compression,
  requestTimeout,
  keep_alive,
}) => {
  const { origin, username, password, database } = parseDatabaseUrl(uri);

  return new EdgeClickHouseClient({
    application: applicationName,
    session_id: sessionId ? [applicationName, sessionId].filter(Boolean).join('_') : undefined,
    host: origin,
    username: username || '',
    password: password || '',
    database: noDatabase ? undefined : database,
    request_timeout: requestTimeout || 30_000,
    compression,
    keep_alive,
    clickhouse_settings: {
      ...defaultClickhouseSettings,
      ...clickhouse_settings,
    },
  });
};
