import type { ClickHouseSettings } from '@clickhouse/client';

export const defaultClickhouseSettings: ClickHouseSettings = {
  // Push batching inserts to the clickhouse server so that we don't need to manage
  // that complexity on the app side
  async_insert: 1,
  wait_for_async_insert: 1,
};
