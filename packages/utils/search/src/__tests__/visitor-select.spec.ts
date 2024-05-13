import { describe, expect, it } from 'vitest';

import { parseSearch } from '../parse.ts';
import { createSearchVisitor } from '../visitor.ts';
import { whereCaseGroups } from './fixtures/common.ts';

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

describe.each(Object.entries(whereCaseGroups))('select %s', (_, cases) => {
  it.each(cases)('%s', (_, input) => {
    expect({
      input,
      result: prettyPrintParseResult(input),
    }).toMatchSnapshot();
  });
});
