import { describe, expect, it } from 'vitest';

import { parseSearch } from '../parse.ts';
import { createSearchVisitor, type SearchQueryAstNode } from '../visitor.ts';

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
      type: 'search_query',
      fromClause: {
        type: 'from_clause',
        table: 'accounts',
      },
      selectClause: {
        type: 'select_clause',
        expr: {
          type: 'select_expr',
          columns: [
            {
              type: 'text',
              quoted: false,
              value: 'id',
            },
          ],
        },
      },
    } satisfies SearchQueryAstNode);
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
      type: 'search_query',
      fromClause: {
        type: 'from_clause',
        table: 'accounts',
      },
      whereClause: {
        type: 'where_clause',
        expr: {
          type: 'where_expr',
          conditions: [
            {
              type: 'qualifier',
              lhs: {
                type: 'qualifier_key',
                value: 'plan',
              },
              negated: false,
              op: '',
              rhs: {
                type: 'text',
                quoted: false,
                value: 'free',
              },
            },
          ],
        },
      },
    } satisfies SearchQueryAstNode);
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
      type: 'search_query',
      fromClause: {
        type: 'from_clause',
        table: 'accounts',
      },
      selectClause: {
        type: 'select_clause',
        expr: {
          type: 'select_expr',
          columns: [
            {
              type: 'text',
              quoted: false,
              value: 'id',
            },
            {
              type: 'text',
              quoted: false,
              value: 'slug',
            },
            {
              type: 'function',
              args: [
                {
                  type: 'function_arg',
                  position: 0,
                  vals: [
                    {
                      type: 'text',
                      quoted: false,
                      value: 'invoices',
                    },
                  ],
                },
              ],
              name: 'count',
              negated: false,
              op: undefined,
              rhs: undefined,
            },
          ],
        },
      },
      whereClause: {
        type: 'where_clause',
        expr: {
          type: 'where_expr',
          conditions: [
            {
              type: 'qualifier',
              lhs: {
                type: 'qualifier_key',
                value: 'plan',
              },
              negated: false,
              op: '',
              rhs: {
                type: 'text',
                quoted: false,
                value: 'free',
              },
            },
          ],
        },
      },
    } satisfies SearchQueryAstNode);
  });
});
