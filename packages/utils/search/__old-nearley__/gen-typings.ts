import { generateCstDts } from 'chevrotain';
import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { productions } from './parse-new.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dtsString = generateCstDts(productions);
const dtsPath = resolve(__dirname, 'parse-new-types.ts');
writeFileSync(dtsPath, dtsString);
