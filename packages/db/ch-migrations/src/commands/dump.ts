import * as fs from 'node:fs/promises';

import { DEFAULT_SCHEMA_PATH } from '../consts.ts';
import type { Driver } from '../types.ts';

export interface DumpOpts {
  driver: Driver;
  schemaPath?: string;
  debug?: boolean;
}

export const dump = async ({ driver, schemaPath = DEFAULT_SCHEMA_PATH }: DumpOpts) => {
  const schema = await driver.dumpSchema();
  await fs.writeFile(schemaPath, schema, 'utf8');
};
