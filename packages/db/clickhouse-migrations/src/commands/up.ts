import { createLogger, logTask } from '../logger.ts';
import { processMigrations, runWithLock } from '../runner.ts';
import type { Driver } from '../types.ts';
import type { DumpOpts } from './dump.ts';
import { dump } from './dump.ts';

export interface UpOpts extends Pick<DumpOpts, 'schemaPath'> {
  driver: Driver;
  migrationFolder: string;
  noDumpSchema?: boolean;
  debug?: boolean;
}

export const up = async ({ driver, migrationFolder, noDumpSchema, debug, schemaPath }: UpOpts) => {
  const logger = createLogger({ debug });

  await logTask(logger, driver.ensureMigrationsTable, { name: 'creating migration tables' });
  await runWithLock(() => processMigrations({ migrationFolder, logger, driver }), { logger, driver });

  if (!noDumpSchema) {
    await dump({ driver, debug, schemaPath });
  }
};
