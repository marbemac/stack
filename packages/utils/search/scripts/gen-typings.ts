import { generateCstDts, type Rule } from 'chevrotain';
import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { SearchParser } from '../src/grammar/parser.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const parser = new SearchParser();
const productions: Record<string, Rule> = parser.getGAstProductions();

const dtsString = generateCstDts(productions, {
  visitorInterfaceName: 'TSearchCstVisitor',
});

const dtsPath = resolve(__dirname, '..', 'src', 'grammar', 'parser-cst-types.ts');
writeFileSync(
  dtsPath,
  [
    '/* eslint-disable @typescript-eslint/consistent-type-definitions */',
    '// generated via yarn build.grammar-types',
    dtsString,
  ].join('\n\n'),
);
