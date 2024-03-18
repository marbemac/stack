import { createLogger, logTask } from '../logger.ts';
import { processMigrations, runWithLock } from '../runner.ts';
import type { Driver } from '../types.ts';
import type { DumpOpts } from './dump.ts';
import { dump } from './dump.ts';

export interface ResetOpts extends Pick<DumpOpts, 'schemaPath'> {
  driver: Driver;
  migrationFolder: string;
  noDumpSchema?: boolean;
  debug?: boolean;
}

export const reset = async ({ driver, migrationFolder, noDumpSchema, debug, schemaPath }: ResetOpts) => {
  const logger = createLogger({ debug });

  await logTask(logger, driver.dropDatabase, { name: 'dropping database' });
  await logTask(logger, driver.createDatabase, { name: 'creating database' });
  await logTask(logger, driver.ensureMigrationsTable, { name: 'creating migration tables' });
  await runWithLock(() => processMigrations({ migrationFolder, logger, driver }), { logger, driver });

  if (!noDumpSchema) {
    await dump({ driver, debug, schemaPath });
  }
};
