import { describe, expect, it } from 'vitest';

import { parseSearch } from '../parse.ts';
import { createSearchVisitor } from '../visitor.ts';

describe('parse full query', () => {
  it('works', () => {
    const { cst, errors } = parseSearch({
      inputType: 'searchQuery',
      input: `
        SELECT id slug count(invoices)
        FROM accounts
        WHERE plan:free
      `,
    });

    expect(errors).toEqual([]);

    const visitor = createSearchVisitor();
    const ast = visitor.searchQuery(cst.children);

    expect(ast).toMatchObject({
      type: 'searchQuery',
      fromClause: {
        table: 'accounts',
        type: 'fromClause',
      },
      selectClause: {
        columns: [
          {
            quoted: false,
            type: 'textVal',
            value: 'id',
          },
          {
            quoted: false,
            type: 'textVal',
            value: 'slug',
          },
          {
            args: [
              [
                {
                  quoted: false,
                  type: 'textVal',
                  value: 'invoices',
                },
              ],
            ],
            name: 'count',
            negated: false,
            op: undefined,
            rhs: undefined,
            type: 'function',
          },
        ],
        type: 'selectClause',
      },
      whereClause: {
        conditions: [
          {
            lhs: {
              type: 'qualifierKey',
              value: 'plan',
            },
            negated: false,
            op: '',
            rhs: {
              quoted: false,
              type: 'textVal',
              value: 'free',
            },
            type: 'qualifier',
          },
        ],
        type: 'whereClause',
      },
    });
  });
});
