import type { ClickHouseClient } from '@clickhouse/client';
import { createClient as baseCreateClient } from '@marbemac/db-clickhouse-client';
import { parseDatabaseUrl } from '@marbemac/utils-urls';

import { DEFAULT_MIGRATIONS_TABLE } from '../consts.ts';
import type { Driver, DriverOpts, MigrationLockRow, MigrationRow } from '../types.ts';

export class ClickHouseDriver implements Driver {
  #rootClient: ClickHouseClient;
  #databaseClient: ClickHouseClient;
  #databaseName: string;
  #migrationsTable: string;
  #migrationsLockTable: string;

  constructor({ databaseUrl, migrationsTable }: DriverOpts) {
    this.#rootClient = createClient({ uri: databaseUrl, noDatabase: true });
    this.#databaseClient = createClient({ uri: databaseUrl });
    this.#databaseName = parseDatabaseUrl(databaseUrl).database;
    this.#migrationsTable = migrationsTable || DEFAULT_MIGRATIONS_TABLE;
    this.#migrationsLockTable = `${this.#migrationsTable}_lock`;
  }

  public dropDatabase = () => {
    return this.#rootClient.exec({
      query: `DROP DATABASE IF EXISTS ${this.#databaseName}`,
    });
  };

  public createDatabase = () => {
    return this.#rootClient.exec({
      query: `CREATE DATABASE IF NOT EXISTS ${this.#databaseName}`,
    });
  };

  public dumpSchema = async () => {
    const lines: string[] = [];

    await this.#schemaDump(lines);
    await this.#schemaMigrationsDump(lines);

    return lines.join('');
  };

  public ensureMigrationsTable = async () => {
    await this.#databaseClient.exec({
      query: `
      CREATE TABLE IF NOT EXISTS ${this.#migrationsTable}
      (
        version String,
        ts DateTime default now(),
        applied UInt8 default 1
      )
      ENGINE = ReplacingMergeTree(ts)
      ORDER BY (version)`,
    });

    await this.#databaseClient.exec({
      query: `
      CREATE TABLE IF NOT EXISTS ${this.#migrationsLockTable}
      (
        id String,
        is_locked UInt8 default 0,
        ts DateTime64(6) default now64()
      )
      ENGINE = ReplacingMergeTree(ts)
      ORDER BY (id)`,
    });
  };

  public selectMigrations = async () => {
    const res = await this.#databaseClient.query({
      format: 'JSONEachRow',
      query: `
        SELECT version
        FROM ${this.#migrationsTable}
        FINAL
        WHERE applied
        ORDER BY version DESC
      `,
    });

    return res.json<MigrationRow[]>();
  };

  public selectMigrationLock = async () => {
    const res = await this.#databaseClient.query({
      format: 'JSONEachRow',
      query: `
        SELECT is_locked
        FROM ${this.#migrationsLockTable}
        FINAL
        LIMIT 1
      `,
    });

    const isLocked = (await res.json<MigrationLockRow[]>())?.[0]?.is_locked;

    return isLocked === void 0 ? false : isLocked;
  };

  public grabMigrationLock = () => {
    return this.#databaseClient.insert<MigrationLockRow>({
      format: 'JSONEachRow',
      table: this.#migrationsLockTable,
      values: [{ id: 'migration_lock', is_locked: true }],
    });
  };

  public releaseMigrationLock = () => {
    return this.#databaseClient.insert<MigrationLockRow>({
      format: 'JSONEachRow',
      table: this.#migrationsLockTable,
      values: [{ id: 'migration_lock', is_locked: false }],
    });
  };

  public runUpMigration = async (version: string, sqlCommands: string[]) => {
    for (const command of sqlCommands) {
      await this.#databaseClient.exec({
        query: command,
      });
    }

    await this.#databaseClient.insert({
      table: this.#migrationsTable,
      format: 'JSONEachRow',
      values: [{ version, applied: 1 }],
    });
  };

  #schemaDump = async (lines: string[]) => {
    lines.push('\n--\n-- Database schema\n--\n\n');
    lines.push(`CREATE DATABASE IF NOT EXISTS ${this.#databaseName};\n\n`);

    const tablesRes = await this.#databaseClient.query({
      format: 'JSONEachRow',
      query: 'SHOW TABLES',
    });

    const tables = (await tablesRes.json<Array<{ name: string }>>()).map(t => t.name).sort();

    for (const table of tables) {
      // skip auto generated inner tables
      if (table.startsWith('.inner')) continue;

      const tableRes = await this.#databaseClient.query({
        format: 'JSONEachRow',
        query: `SHOW CREATE TABLE ${table}`,
      });

      const tableDetails = (await tableRes.json<Array<{ statement: string }>>())?.[0]!.statement;

      lines.push(`${tableDetails};\n\n`);
    }
  };

  #schemaMigrationsDump = async (lines: string[]) => {
    const migrations = await this.selectMigrations();
    const versions = migrations.map(m => m.version).reverse();

    lines.push('\n--\n-- Schema migrations\n--\n\n');
    lines.push(`INSERT INTO ${this.#migrationsTable} (version) VALUES\n    ('${versions.join("'),\n    ('")}');\n`);
  };
}

const createClient = (opts: { uri: string; noDatabase?: boolean }) => {
  return baseCreateClient({
    applicationName: 'migrations',
    ...opts,
  }) as ClickHouseClient;
};
