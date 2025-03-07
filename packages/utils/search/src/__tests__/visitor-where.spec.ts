import { describe, expect, it } from 'vitest';

import { parseSearch } from '../parse.ts';
import { createSearchVisitor } from '../visitor.ts';
import { caseGroups } from './fixtures/common.ts';

const prettyPrintParseResult = (input: string) => {
  const { cst, errors } = parseSearch({ input: input, inputType: 'whereExpr' });

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

  const ast = visitor.whereExpr(cst.children);

  return { errors, ast };
};

describe.each(Object.entries(caseGroups))('where %s', (_, cases) => {
  it.each(cases)('%s', (_, input) => {
    expect({
      input,
      result: prettyPrintParseResult(input),
    }).toMatchSnapshot();
  });
});
