import { describe, expect, it } from 'vitest';

import { parseSearch } from '../parse.ts';
import { treeTransformer } from '../utils.ts';
import { createSearchVisitor } from '../visitor.ts';
import { whereCaseGroups } from './fixtures/common.ts';

const prettyPrintParseResult = (input: string) => {
  const { cst } = parseSearch({ input: input, inputType: 'selectExpression' });

  const visitor = createSearchVisitor();
  const ast = visitor.selectExpression(cst.children);

  /**
   * Just cleans up the snapshots a little bit for easier review
   */
  return treeTransformer({
    tree: ast,
    transform: token => {
      // @ts-expect-error remove `quoted` property if false, since that's the default
      if (token.quoted === false) delete token.quoted;

      // @ts-expect-error remove `negated` property if false, since that's the default
      if (token.negated === false) delete token.negated;

      return token;
    },
  });
};

describe.each(Object.entries(whereCaseGroups))('select %s', (_, cases) => {
  it.each(cases)('%s', (_, input) => {
    expect({
      input,
      result: prettyPrintParseResult(input),
    }).toMatchSnapshot();
  });
});

it('debug', { skip: true }, () => {
  const input = 'user:[jane, "john doe"] release:[12.0]';
  // const input = 'one:two "foo bar" three:four';
  // const input = 'last_seen:+1d';

  const lexResult = { tokens: [] };
  // const { lexResult } = parseQuery({ input: input as SearchString, inputType: 'whereExpression' });

  expect(lexResult.tokens).toMatchInlineSnapshot(`[]`);

  expect(prettyPrintParseResult(input)).toMatchInlineSnapshot();
});