import { expect, it } from 'vitest';

import { createLexer } from '../lexer.ts';
import { cases } from './cases.ts';

const prettyPrintLexer = (text: string) => {
  const lexer = createLexer();

  lexer.reset(text);

  const pretty: string[] = [];
  for (const r of lexer) {
    if (['qualKey', 'qualVal', 'string', 'qualOp'].includes(r.type || '')) {
      pretty.push(`[${r.type}] ${r.value}${r.value !== r.text ? ` (text=${r.text})` : ''}`);
      continue;
    }

    pretty.push(`[${r.type}]`);
  }

  return pretty;
};

it.each(cases)('%s', (_, input) => {
  expect({
    input,
    result: prettyPrintLexer(input),
  }).toMatchSnapshot();
});
