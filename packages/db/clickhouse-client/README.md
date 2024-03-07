# @marbemac/db-clickhouse-client

Defines an interface that covers a subset of the official `@clickhouse/client` JS client.

Uses the official `@clickhouse/client` client in `node` environments, and a custom edge-compatible when in browser-like
/ edge environments.

```bash
# To debug and experiment during development
# Not running these as tests ATM, because would require clickhouse infra to be online in all the places we run tests
yarn workspace @marbemac/db-clickhouse-client debug.watch
```

## Examples

### Create a Client

```ts
import { createClient } from '@marbemac/db-clickhouse-client';

const CLICKHOUSE_HTTP_URL = 'http://db_user:db_password@localhost:8123/db_name';

const c = createClient({
  uri: CLICKHOUSE_HTTP_URL,
  applicationName: 'consuming-app-name',
  sessionId: 'optional-unique-session-id', // recommended
});
```

### Admin Queries

**Get table information**

```sql
SELECT
    database,
    table,
    formatReadableSize(sum(data_compressed_bytes) AS size) AS compressed,
    formatReadableSize(sum(data_uncompressed_bytes) AS usize) AS uncompressed,
    round(usize / size, 2) AS compr_rate,
    sum(rows) AS rows,
    count() AS part_count,
    any(engine) as engine,
    max(modification_time) as latest_modification
FROM system.parts
WHERE (active = 1) AND (database LIKE '%') AND (table LIKE '%')
GROUP BY
    database,
    table
ORDER BY size DESC;
```

**Get column information**

```sql
SELECT
    database,
    table,
    column,
    formatReadableSize(sum(column_data_compressed_bytes) AS size) AS compressed,
    formatReadableSize(sum(column_data_uncompressed_bytes) AS usize) AS uncompressed,
    round(usize / size, 2) AS compr_ratio,
    sum(rows) rows_cnt,
    round(usize / rows_cnt, 2) avg_row_size
FROM system.parts_columns
WHERE (active = 1) AND (database LIKE '%') AND (table LIKE '%')
GROUP BY
    database,
    table,
    column
ORDER BY size DESC;
```

### Queries

**Basic Query**

```ts
import type { JSONResult } from '@marbemac/db-clickhouse-client';

const q = await c.query<JSONResult<{ time_zone: string }>>({
  format: 'JSON',
  query: `SELECT * FROM system.time_zones ORDER BY time_zone ASC LIMIT 5;`,
});
```

**With Query Parameters**

```ts
import type { JSONResult } from '@marbemac/db-clickhouse-client';

const q = await c.query<JSONResult<{ company_external_id: string; first_event_at: string }>>({
  format: 'JSON',
  query_params: {
    org_id: 'org_marbemac',
  },
  query: `
  SELECT
    company_external_id,
    min(event_time) AS first_event_at
  FROM events
  WHERE
    org_id = {org_id:String}
  GROUP BY company_external_id;
  `,
});
```

### Exec

TODO
