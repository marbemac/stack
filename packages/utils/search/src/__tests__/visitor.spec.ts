import { describe, expect, it } from 'vitest';

import { parseSearch } from '../parse.ts';
import { createSearchVisitor } from '../visitor.ts';

describe('parse full query', () => {
  it('supports just select', () => {
    const { cst, errors } = parseSearch({
      inputType: 'searchQuery',
      input: `
        FROM accounts
        SELECT id
      `,
    });

    expect(errors).toEqual([]);

    const visitor = createSearchVisitor();
    const ast = visitor.searchQuery(cst.children);

    expect(ast).toMatchObject({
      type: 'searchQuery',
      fromClause: {
        type: 'fromClause',
        table: 'accounts',
      },
      selectClause: {
        type: 'selectClause',
        columns: [
          {
            type: 'textVal',
            quoted: false,
            value: 'id',
          },
        ],
      },
    });
  });

  it('supports just where', () => {
    const { cst, errors } = parseSearch({
      inputType: 'searchQuery',
      input: `
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
        type: 'fromClause',
        table: 'accounts',
      },
      whereClause: {
        type: 'whereClause',
        conditions: [
          {
            type: 'qualifier',
            lhs: {
              type: 'qualifierKey',
              value: 'plan',
            },
            negated: false,
            op: '',
            rhs: {
              type: 'textVal',
              quoted: false,
              value: 'free',
            },
          },
        ],
      },
    });
  });

  it('supports select + where', () => {
    const { cst, errors } = parseSearch({
      inputType: 'searchQuery',
      input: `
        FROM accounts
        SELECT id slug count(invoices)
        WHERE plan:free
      `,
    });

    expect(errors).toEqual([]);

    const visitor = createSearchVisitor();
    const ast = visitor.searchQuery(cst.children);

    expect(ast).toMatchObject({
      type: 'searchQuery',
      fromClause: {
        type: 'fromClause',
        table: 'accounts',
      },
      selectClause: {
        type: 'selectClause',
        columns: [
          {
            type: 'textVal',
            quoted: false,
            value: 'id',
          },
          {
            type: 'textVal',
            quoted: false,
            value: 'slug',
          },
          {
            type: 'function',
            args: [
              [
                {
                  type: 'textVal',
                  quoted: false,
                  value: 'invoices',
                },
              ],
            ],
            name: 'count',
            negated: false,
            op: undefined,
            rhs: undefined,
          },
        ],
      },
      whereClause: {
        type: 'whereClause',
        conditions: [
          {
            type: 'qualifier',
            lhs: {
              type: 'qualifierKey',
              value: 'plan',
            },
            negated: false,
            op: '',
            rhs: {
              type: 'textVal',
              quoted: false,
              value: 'free',
            },
          },
        ],
      },
    });
  });
});
