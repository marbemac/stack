import { createClient as baseCreateClient } from '@clickhouse/client';

import { defaultClickhouseSettings } from '../settings.ts';
import type { ClickHouseClient, CreateClientFn } from '../types.ts';

const clients = new Map<string, ClickHouseClient>();

export const createClient: CreateClientFn = ({
  uri,
  applicationName,
  requestTimeout,
  noDatabase,
  sessionId,
  compression,
  clickhouse_settings,
  keep_alive,
}) => {
  const clientId = [applicationName, noDatabase, sessionId].join('_');

  let client = clients.get(clientId);

  // re-use in a node environment
  if (client) {
    return client;
  }

  const url = new URL(uri);
  if (noDatabase) {
    url.pathname = '';
  }

  client = baseCreateClient({
    application: applicationName,
    session_id: sessionId ? [applicationName, sessionId].filter(Boolean).join('_') : undefined,
    url,
    request_timeout: requestTimeout || 30_000,
    compression,
    keep_alive,
    clickhouse_settings: {
      ...defaultClickhouseSettings,
      ...clickhouse_settings,
    },
  }) as unknown as ClickHouseClient;

  clients.set(clientId, client);

  return client;
};
