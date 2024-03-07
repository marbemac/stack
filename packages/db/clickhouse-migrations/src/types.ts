export interface DriverOpts {
  databaseUrl: string;
  migrationsTable?: string;
}

export interface MigrationRow {
  version: string;
}

export interface MigrationLockRow {
  id: 'migration_lock';
  is_locked: boolean;
}

export interface Driver {
  dropDatabase: () => Promise<unknown>;
  createDatabase: () => Promise<unknown>;
  dumpSchema: () => Promise<string>;
  ensureMigrationsTable: () => Promise<unknown>;
  selectMigrations: () => Promise<MigrationRow[]>;
  selectMigrationLock: () => Promise<boolean>;
  grabMigrationLock: () => Promise<unknown>;
  releaseMigrationLock: () => Promise<unknown>;
  runUpMigration: (version: string, sqlCommands: string[]) => Promise<unknown>;
}
