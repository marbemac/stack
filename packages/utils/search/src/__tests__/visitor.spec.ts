import type { PartialDeep } from '@marbemac/utils-types';
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
              isBranchInvalid: false,
            },
          ],
        },
      },
    } satisfies PartialDeep<SearchQueryAstNode>);
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
              isBranchInvalid: false,
              lhs: {
                type: 'qualifier_key',
                value: 'plan',
                isBranchInvalid: false,
              },
              negated: false,
              op: '',
              rhs: {
                type: 'text',
                quoted: false,
                value: 'free',
                isBranchInvalid: false,
              },
            },
          ],
        },
      },
    } satisfies PartialDeep<SearchQueryAstNode>);
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
              isBranchInvalid: false,
            },
            {
              type: 'text',
              quoted: false,
              value: 'slug',
              isBranchInvalid: false,
            },
            {
              type: 'function',
              args: [
                {
                  type: 'function_arg',
                  position: 0,
                  isBranchInvalid: false,
                  vals: [
                    {
                      type: 'text',
                      quoted: false,
                      value: 'invoices',
                      isBranchInvalid: false,
                    },
                  ],
                },
              ],
              name: 'count',
              negated: false,
              op: undefined,
              rhs: undefined,
              isBranchInvalid: false,
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
              isBranchInvalid: false,
              lhs: {
                type: 'qualifier_key',
                value: 'plan',
                isBranchInvalid: false,
              },
              negated: false,
              op: '',
              rhs: {
                type: 'text',
                quoted: false,
                value: 'free',
                isBranchInvalid: false,
              },
            },
          ],
        },
      },
    } satisfies PartialDeep<SearchQueryAstNode>);
  });
});
