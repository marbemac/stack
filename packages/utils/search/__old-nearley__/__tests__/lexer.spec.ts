import { describe, expect, it } from 'vitest';

import { createLexer } from '../lexer.ts';
import { caseGroups } from './cases.ts';

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

// describe.each(Object.entries(caseGroups))('%', (_, cases) => {
//   it.each(cases)('%s', (_, input) => {
//     expect({
//       input,
//       result: prettyPrintLexer(input),
//     }).toMatchSnapshot();
//   });
// });

it('debug', () => {
  const lexer = createLexer();
  lexer.reset('fullname(foo:fee, bar:fee)');

  const results: any[] = [];
  for (const r of lexer) {
    results.push(r);
  }

  expect(results).toMatchInlineSnapshot(`
    [
      {
        "col": 1,
        "line": 1,
        "lineBreaks": 0,
        "offset": 0,
        "text": "fullname(",
        "toString": [Function],
        "type": "funcName",
        "value": "fullname",
      },
      {
        "col": 10,
        "line": 1,
        "lineBreaks": 0,
        "offset": 9,
        "text": "foo:",
        "toString": [Function],
        "type": "qualKey",
        "value": "foo",
      },
      {
        "col": 14,
        "line": 1,
        "lineBreaks": 0,
        "offset": 13,
        "text": "fee",
        "toString": [Function],
        "type": "qualVal",
        "value": "fee",
      },
      {
        "col": 17,
        "line": 1,
        "lineBreaks": 0,
        "offset": 16,
        "text": ",",
        "toString": [Function],
        "type": "comma",
        "value": ",",
      },
      {
        "col": 18,
        "line": 1,
        "lineBreaks": 0,
        "offset": 17,
        "text": " ",
        "toString": [Function],
        "type": "space",
        "value": " ",
      },
      {
        "col": 19,
        "line": 1,
        "lineBreaks": 0,
        "offset": 18,
        "text": "bar:",
        "toString": [Function],
        "type": "qualKey",
        "value": "bar",
      },
      {
        "col": 23,
        "line": 1,
        "lineBreaks": 0,
        "offset": 22,
        "text": "fee",
        "toString": [Function],
        "type": "qualVal",
        "value": "fee",
      },
      {
        "col": 26,
        "line": 1,
        "lineBreaks": 0,
        "offset": 25,
        "text": ")",
        "toString": [Function],
        "type": "rparen",
        "value": ")",
      },
    ]
  `);
});
