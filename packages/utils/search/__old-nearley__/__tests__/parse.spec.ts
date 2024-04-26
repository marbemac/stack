import nearley from 'nearley';
import { expect, it } from 'vitest';

import grammar from '../grammar.ts';
import { isRawToken, parseSearchQuery } from '../parse.ts';
import type { SearchString } from '../types.ts';
import { cases } from './cases.ts';

const prettyPrintParseResult = (input: string) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  const res = parseSearchQuery(input as SearchString, { parser });

  const pretty: string[] = [];
  for (const r of res.tokens) {
    if (isRawToken(r)) {
      pretty.push(`${r.value}`);
      continue;
    }

    if (Array.isArray(r.val)) {
      pretty.push(`${r.key.value} IN (${r.val.map(v => v.value).join(', ')})`);
      continue;
    }

    pretty.push(`${r.key.value} ${r.op} ${r.val.value}`);
  }

  return pretty;
};

it.each(cases)('%s', (_, input) => {
  expect({
    input,
    result: prettyPrintParseResult(input),
  }).toMatchSnapshot();
});
