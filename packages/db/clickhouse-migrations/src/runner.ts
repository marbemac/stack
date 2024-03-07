import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import type { Logger } from './logger.ts';
import { logTask } from './logger.ts';
import type { Driver } from './types.ts';

export const runWithLock = async (
  fn: () => Promise<unknown>,
  { logger, driver }: { logger: Logger; driver: Driver },
) => {
  const isLocked = await driver.selectMigrationLock();
  if (isLocked) {
    logger.debug('Migrations are locked... aborting');
    return;
  }

  await driver.grabMigrationLock();

  try {
    await fn();
  } finally {
    await driver.releaseMigrationLock();
  }
};

export const processMigrations = async ({
  migrationFolder,
  logger,
  driver,
}: {
  migrationFolder: string;
  logger: Logger;
  driver: Driver;
}) => {
  const previouslyRunMigrations = (await driver.selectMigrations()).map(m => m.version);
  const migrationFiles = (await readMigrationFiles({ migrationFolder })).filter(
    f => !previouslyRunMigrations.includes(f.split('_')[0]!),
  );

  for (const migrationFile of migrationFiles) {
    await logTask(logger, () => processMigration({ migrationFolder, migrationFile, driver }), {
      name: `running ${migrationFile}`,
    });
  }
};

const readMigrationFiles = async ({ migrationFolder }: { migrationFolder: string }) => {
  const migrationFiles = await fs.readdir(migrationFolder);
  if (!migrationFiles || !migrationFiles.length) {
    throw new Error(`No migrations found at "${path.resolve(migrationFolder)}"`);
  }

  return migrationFiles;
};

const processMigration = async ({
  migrationFolder,
  migrationFile,
  driver,
}: {
  migrationFolder: string;
  migrationFile: string;
  driver: Driver;
}) => {
  const version = migrationFile.split('_')[0]!;

  const sqlCommands: string[] = [];
  const resoledPath = path.resolve(migrationFolder, migrationFile);
  const ext = path.extname(migrationFile);
  if (ext === '.sql') {
    const fileContents = await fs.readFile(resoledPath, 'utf8');
    sqlCommands.push(fileContents);
  } else if (ext === '.ts') {
    const { up } = await import(resoledPath);
    const res = up();
    if (Array.isArray(res)) {
      sqlCommands.push(...res);
    } else if (typeof res === 'string') {
      sqlCommands.push(res);
    } else {
      throw new Error(`Migration up function must return a string, or an array of strings (${migrationFile})`);
    }
  } else {
    throw new Error(`Migration with extension ${ext} not understood (${migrationFile})`);
  }

  const processedSqlCommands = sqlCommands.map(s => replaceEnvVars(migrationFile, s));

  await driver.runUpMigration(version, processedSqlCommands);
};

const ENV_VAR_REGEX = /\{\{([\w|-]+)\}\}/g;

const replaceEnvVars = (migrationFile: string, sqlCommand: string) => {
  const matches = [...new Set(Array.from(sqlCommand.matchAll(ENV_VAR_REGEX)).map(m => m[1]))];

  for (const match of matches) {
    if (!match) continue;

    const varValue = process.env[match];
    if (varValue === void 0) {
      throw new Error(`No value found for env variable ${match} while processing migration ${migrationFile}`);
    }

    sqlCommand = sqlCommand.replaceAll(`{{${match}}}`, varValue);
  }

  return sqlCommand;
};
