import { describe, expect, it } from 'vitest';

import { parseSearch } from '../parse.ts';
import { createSearchVisitor } from '../visitor.ts';
import { caseGroups } from './fixtures/common.ts';

const prettyPrintParseResult = (input: string) => {
  const { cst, errors } = parseSearch({ input: input, inputType: 'selectExpr' });

  const visitor = createSearchVisitor({
    /**
     * Just cleans up the snapshots a little bit for easier review
     */
    transform: node => {
      // @ts-expect-error remove `quoted` property if false, since that's the default
      if (node.quoted === false) delete node.quoted;

      // @ts-expect-error remove `negated` property if false, since that's the default
      if (node.negated === false) delete node.negated;

      // @ts-expect-error remove `sort` property if undefined, since that's the default
      if (typeof node.sort === 'undefined') delete node.sort;

      if (node.isBranchInvalid === false) {
        // @ts-expect-error remove `isBranchInvalid` property if false, since that's the default
        delete node.isBranchInvalid;
      }

      return node;
    },
  });

  const ast = visitor.selectExpr(cst.children);

  return { errors, ast };
};

describe.each(Object.entries(caseGroups))('select %s', (_, cases) => {
  it.each(cases)('%s', (_, input) => {
    expect({
      input,
      result: prettyPrintParseResult(input),
    }).toMatchSnapshot();
  });
});

describe('sorting', () => {
  it('supports text vals', () => {
    expect(prettyPrintParseResult('+name').ast.columns[0]).toMatchObject({ sort: 'asc' });
  });

  it('supports desc', () => {
    expect(prettyPrintParseResult('-name').ast.columns[0]).toMatchObject({ sort: 'desc' });
  });

  it('supports functions', () => {
    expect(prettyPrintParseResult('+count()').ast.columns[0]).toMatchObject({ sort: 'asc' });
  });
});

it('supports tags that start with a $', () => {
  expect(prettyPrintParseResult('$first_seen').ast.columns[0]).toMatchObject({
    value: '$first_seen',
  });
});
