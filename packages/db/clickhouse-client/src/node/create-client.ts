import { createClient as baseCreateClient } from '@clickhouse/client';
import { isReadableStream } from '@marbemac/utils-streams';
import { parseDatabaseUrl } from '@marbemac/utils-urls';
import { Readable } from 'stream';

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
}) => {
  const clientId = [applicationName, noDatabase, sessionId].join('_');

  let client = clients.get(clientId);

  // re-use in a node environment
  if (client) {
    return client;
  }

  const { origin, username, password, database } = parseDatabaseUrl(uri);

  client = baseCreateClient({
    application: applicationName,
    session_id: sessionId ? [applicationName, sessionId].filter(Boolean).join('_') : undefined,
    host: origin,
    username,
    password,
    database: noDatabase ? undefined : database,
    request_timeout: requestTimeout,
    compression,
    clickhouse_settings: {
      ...defaultClickhouseSettings,
      ...clickhouse_settings,
    },
  }) as unknown as ClickHouseClient;

  /**
   * Patch query stream to return a web stream rather than a node stream
   */
  const originalQuery = client.query.bind(client);
  client.query = (async (...args) => {
    // @ts-expect-error ignore
    const baseRes = await originalQuery(...args);

    const originalStream = baseRes.stream.bind(baseRes);
    // @ts-expect-error ignore
    baseRes.stream = () => {
      const baseStream = originalStream();
      // @ts-expect-error ignore
      return Readable.toWeb(baseStream);
    };

    return baseRes;
  }) as ClickHouseClient['query'];

  /**
   * Patch insert to accept a web stream for values rather than a node stream
   */
  const originalInsert = client.insert.bind(client);
  client.insert = (({ values, ...params }) => {
    return originalInsert({
      // @ts-expect-error ignore
      values: isReadableStream(values) ? Readable.fromWeb(values, { objectMode: true }) : values,
      ...params,
    });
  }) as ClickHouseClient['insert'];

  clients.set(clientId, client);

  return client;
};
