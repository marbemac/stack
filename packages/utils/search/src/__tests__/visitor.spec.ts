import type { PartialDeep } from '@marbemac/utils-types';
import { describe, expect, it } from 'vitest';

import { parseSearch } from '../parse.ts';
import { createSearchVisitor, type SearchQueryAstNode } from '../visitor.ts';

describe('parse full query', () => {
  it('supports just select', () => {
    const { cst, errors } = parseSearch({
      inputType: 'searchQuery',
      input: `
        FROM tenants
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
        table: 'tenants',
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
        FROM tenants
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
        table: 'tenants',
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

  it('supports group', () => {
    const { cst, errors } = parseSearch({
      inputType: 'searchQuery',
      input: `
        FROM person
        GROUP industry
        SELECT count()
      `,
    });

    expect(errors).toEqual([]);

    const visitor = createSearchVisitor();
    const ast = visitor.searchQuery(cst.children);

    expect(ast).toMatchObject({
      type: 'search_query',
      fromClause: {
        type: 'from_clause',
        table: 'person',
      },
      groupClause: {
        type: 'group_clause',
        expr: {
          type: 'group_expr',
          keys: [
            {
              type: 'text',
              quoted: false,
              value: 'industry',
              isBranchInvalid: false,
            },
          ],
        },
      },
      selectClause: {
        type: 'select_clause',
        expr: {
          type: 'select_expr',
          columns: [
            {
              type: 'function',
              name: 'count',
              isBranchInvalid: false,
            },
          ],
        },
      },
    });
  });

  it('supports group by multiple keys (trait + function)', () => {
    const { cst, errors } = parseSearch({
      inputType: 'searchQuery',
      input: `
        FROM observation
        GROUP month(created_at) kind
        SELECT count()
      `,
    });

    expect(errors).toEqual([]);

    const visitor = createSearchVisitor();
    const ast = visitor.searchQuery(cst.children);

    expect(ast).toMatchObject({
      type: 'search_query',
      groupClause: {
        type: 'group_clause',
        expr: {
          type: 'group_expr',
          keys: [
            { type: 'function', name: 'month', isBranchInvalid: false },
            { type: 'text', value: 'kind', isBranchInvalid: false },
          ],
        },
      },
    });
  });

  it('supports select + where', () => {
    const { cst, errors } = parseSearch({
      inputType: 'searchQuery',
      input: `
        FROM tenants
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
        table: 'tenants',
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
