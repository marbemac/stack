import { Id } from '@marbemac/utils-ids';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createClient as createEdgeClient } from '../edge/create-client.ts';
import { streamAlreadyConsumedMessage } from '../edge/result.ts';
import { createClient as createNodeClient } from '../node/create-client.ts';
import type { ClickHouseClient } from '../types.ts';

const CLICKHOUSE_HTTP_URL = process.env['CLICKHOUSE_HTTP_URL'] || 'http://plg_user:password@localhost:8123/plg';

interface CTX {
  client: ClickHouseClient;
}

const edgeClientFactory = () =>
  createEdgeClient({
    uri: CLICKHOUSE_HTTP_URL,
    applicationName: 'tests',
    sessionId: '123-edge',
  });

const nodeClientFactory = () =>
  createNodeClient({
    uri: CLICKHOUSE_HTTP_URL,
    applicationName: 'tests',
    sessionId: '123-node',
  });

describe.each([
  { name: 'edge', clientFactory: edgeClientFactory },
  { name: 'node', clientFactory: nodeClientFactory },
])('$name client', ({ clientFactory }) => {
  let tmpTableName: string;
  let client: ClickHouseClient;

  beforeAll(async () => {
    tmpTableName = `dev_testing_${Date.now()}`;
    client = clientFactory();

    await client.exec({
      query: `
      CREATE TABLE ${tmpTableName} (
        id UUID,
        group String
      )
      ENGINE=Memory`,
    });
  });

  afterAll(async () => {
    await client.exec({ query: `DROP TABLE ${tmpTableName}` });
  });

  beforeEach<CTX>(async ctx => {
    ctx.client = client;
  });

  describe('queries', () => {
    it<CTX>('simple', async ctx => {
      const q = await ctx.client.query<{ time_zone: string }>({
        format: 'JSONEachRow',
        query: `SELECT * FROM system.time_zones ORDER BY time_zone ASC LIMIT 5;`,
      });

      const res = await q.json();

      expect(res[0]?.time_zone).toEqual('Africa/Abidjan');
    });

    it<CTX>('supports parameters', async ctx => {
      const targetZone = 'America/Chicago';

      const q = await ctx.client.query<{ time_zone: string }>({
        format: 'JSONEachRow',
        query_params: {
          targetZone,
        },
        query: `SELECT time_zone FROM system.time_zones WHERE time_zone = {targetZone:String}`,
      });

      const res = await q.json();

      expect(res.length).toBe(1);
      expect(res[0]?.time_zone).toEqual(targetZone);
    });

    it<CTX>('throws an error if different result methods are accessed', async ctx => {
      const q = await ctx.client.query<{ time_zone: string }>({
        format: 'JSONEachRow',
        query: `SELECT generateUUIDv4() as id FROM numbers(2)`,
      });

      const res = await q.json();

      expect(res.length).toBe(2);

      expect(q.stream.bind(q)).toThrow(streamAlreadyConsumedMessage);
    });

    it<CTX>('streaming works', async ctx => {
      const expectedCount = 5218;
      const q = await ctx.client.query<{ id: string }>({
        format: 'JSONEachRow',
        query: `SELECT generateUUIDv4() as id FROM numbers(${expectedCount})`,
      });

      const res = q.stream();

      let finalCount = 0;
      for await (const rows of res) {
        finalCount += rows.length;
      }

      expect(finalCount).toEqual(expectedCount);
    });
  });

  describe('inserts', () => {
    it<CTX>('streaming works', async ctx => {
      const group = Id.generateDbId();
      const expectedCount = 1555;

      const q = await ctx.client.query<{ id: string }>({
        format: 'JSONEachRow',
        query: `SELECT generateUUIDv4() as id FROM numbers(${expectedCount})`,
      });

      const res = q.stream();

      const withGroup = res.pipeThrough<{ id: string; group: string }>(
        // Little transformer between the read and write side, to add the "group" property
        // that we'll query on after insertion to ensure everything worked
        new TransformStream({
          transform(rows, controller) {
            for (const row of rows) {
              controller.enqueue({
                ...row.json(),
                group,
              });
            }
          },
        }),
      );

      await ctx.client.insert<{ id: string; group: string }>({
        table: tmpTableName,
        format: 'JSONEachRow',
        values: withGroup,
      });

      const q2 = await ctx.client.query<{ id: string }>({
        format: 'JSONEachRow',
        query: `SELECT id, group FROM ${tmpTableName} WHERE group = '${group}'`,
      });

      const res2 = await q2.json();

      expect(res2.length).toBe(expectedCount);
    });
  });
});
