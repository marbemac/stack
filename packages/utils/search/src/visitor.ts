import type { CstNode } from 'chevrotain';

import { SearchParser } from './grammar/parser.ts';
import type {
  AtomicFilterValCstChildren,
  AtomicFilterValCstNode,
  FilterCstChildren,
  FilterCstNode,
  FilterInCstChildren,
  FilterInCstNode,
  FilterKeyCstChildren,
  FilterKeyCstNode,
  FilterOpCstChildren,
  FilterOpCstNode,
  FilterValCstChildren,
  FilterValCstNode,
  FromClauseCstChildren,
  FromClauseCstNode,
  FunctionArgCstChildren,
  FunctionArgCstNode,
  FunctionCstChildren,
  FunctionCstNode,
  SearchQueryCstChildren,
  SearchQueryCstNode,
  SelectClauseCstChildren,
  SelectClauseCstNode,
  TSearchCstVisitor,
  WhereClauseCstChildren,
  WhereClauseCstNode,
  WhereExpressionCstChildren,
  WhereExpressionCstNode,
} from './grammar/parser-cst-types.ts';

export const enum SearchToken {
  SearchQuery = 'searchQuery',
  SelectClause = 'selectClause',
  FromClause = 'fromClause',
  WhereClause = 'whereClause',
  Filter = 'filter',
  Function = 'function',
  FilterKey = 'filterKey',
  FilterIn = 'filterIn',
  AtomicFilterVal = 'atomicFilterVal',
}

export type AnySearchToken =
  | SearchQueryAstNode
  | SelectClauseAstNode
  | FromClauseAstNode
  | WhereClauseAstNode
  | FilterAstNode
  | FunctionAstNode
  | FilterKeyAstNode
  | FilterInAstNode
  | AtomicFilterValAstNode;

export interface SearchQueryAstNode {
  type: SearchToken.SearchQuery;
  selectClause: SelectClauseAstNode;
  fromClause: FromClauseAstNode;
  whereClause: WhereClauseAstNode;
}

export interface SelectClauseAstNode {
  type: SearchToken.SelectClause;
  columns: string[];
}

export interface FromClauseAstNode {
  type: SearchToken.FromClause;
  table: string;
}

export interface WhereClauseAstNode {
  type: SearchToken.WhereClause;
  conditions: WhereExpressionAstNode;
}

export type WhereExpressionAstNode = (FilterAstNode | AtomicFilterValAstNode)[];

export interface FilterAstNode {
  type: SearchToken.Filter;
  negated: boolean;
  lhs: FunctionAstNode | FilterKeyAstNode;
  op?: FilterOpAstNode;
  rhs?: FilterValAstNode;
}

export interface FunctionAstNode {
  type: SearchToken.Function;
  name: string;
  args: FunctionArgAstNode[];
}

export type FunctionArgAstNode = (FilterAstNode | AtomicFilterValAstNode)[];

export interface FilterKeyAstNode {
  type: SearchToken.FilterKey;
  value: string;
}

export type FilterValAstNode = FilterInAstNode | AtomicFilterValAstNode;

export interface FilterInAstNode {
  type: SearchToken.FilterIn;
  values: AtomicFilterValAstNode[];
}

export interface AtomicFilterValAstNode {
  type: SearchToken.AtomicFilterVal;
  quoted;
  value: string;
}

export type FilterOpAstNode = '=' | '>' | '<' | '>=' | '<=' | '+' | '-';

export type SearchVisitor = ReturnType<typeof createSearchVisitor>;

const checkNodeType = (node: unknown, type: string): boolean =>
  !!node && typeof node === 'object' && 'type' in node && node.type === type;

export const isFilterNode = (node: unknown): node is FilterAstNode => checkNodeType(node, SearchToken.Filter);

export const isFunctionNode = (node: unknown): node is FunctionAstNode => checkNodeType(node, SearchToken.Function);

export const isFilterKeyAstNode = (node: unknown): node is FilterKeyAstNode =>
  checkNodeType(node, SearchToken.FilterKey);

export const isFilterInAstNode = (node: unknown): node is FilterInAstNode => checkNodeType(node, SearchToken.FilterIn);

export const isAtomicFilterValAstNode = (node: unknown): node is AtomicFilterValAstNode =>
  checkNodeType(node, 'valueText');

let parserSingleton: SearchParser;

export const createSearchVisitor = () => {
  if (!parserSingleton) {
    parserSingleton = new SearchParser();
  }

  const BaseVisitor = parserSingleton.getBaseCstVisitorConstructor();

  /** This simply helps keep this visitor typings tight. Maps CST nodes to AST nodes. */
  type GetReturnType<T> = T extends SearchQueryCstNode
    ? SearchQueryAstNode
    : T extends SelectClauseCstNode
      ? SelectClauseAstNode
      : T extends FromClauseCstNode
        ? FromClauseAstNode
        : T extends WhereClauseCstNode
          ? WhereClauseAstNode
          : T extends WhereExpressionCstNode
            ? WhereExpressionAstNode
            : T extends FilterCstNode
              ? FilterAstNode
              : T extends FunctionCstNode
                ? FunctionAstNode
                : T extends FunctionArgCstNode
                  ? FunctionArgAstNode
                  : T extends FilterKeyCstNode
                    ? FilterKeyAstNode
                    : T extends FilterValCstNode
                      ? FilterValAstNode
                      : T extends FilterInCstNode
                        ? FilterInAstNode
                        : T extends AtomicFilterValCstNode
                          ? AtomicFilterValAstNode
                          : T extends FilterOpCstNode
                            ? FilterOpAstNode
                            : never;

  type VisitFn = <T extends CstNode | CstNode[]>(cstNode: T, param?: unknown) => GetReturnType<T>;

  class SearchCstVisitor extends BaseVisitor implements TSearchCstVisitor<unknown, unknown> {
    #visit: VisitFn;

    constructor() {
      super();
      this.#visit = this.visit as VisitFn;
      this.validateVisitor();
    }

    searchQuery(ctx: SearchQueryCstChildren) {
      return {
        type: SearchToken.SearchQuery as const,
        selectClause: this.#visit(ctx.selectClause),
        fromClause: this.#visit(ctx.fromClause),
        whereClause: this.#visit(ctx.whereClause!),
      } satisfies SearchQueryAstNode;
    }

    selectClause(ctx: SelectClauseCstChildren) {
      return {
        type: SearchToken.SelectClause as const,
        columns: ctx.Identifier.map(identToken => identToken.image),
      } satisfies SelectClauseAstNode;
    }

    fromClause(ctx: FromClauseCstChildren) {
      return {
        type: SearchToken.FromClause as const,
        table: ctx.Identifier[0]?.image || '',
      } satisfies FromClauseAstNode;
    }

    whereClause(ctx: WhereClauseCstChildren) {
      return {
        type: SearchToken.WhereClause as const,
        conditions: this.#visit(ctx.whereExpression),
      } satisfies WhereClauseAstNode;
    }

    whereExpression(ctx: WhereExpressionCstChildren) {
      return (ctx.conditions || []).map(f => this.#visit(f)) satisfies WhereExpressionAstNode;
    }

    filter(ctx: FilterCstChildren) {
      return {
        type: SearchToken.Filter as const,
        negated: !!ctx.Negate,
        lhs: this.#visit(ctx.lhs!),
        op: this.#visit(ctx.filterOp),
        rhs: this.#visit(ctx.rhs),
      } satisfies FilterAstNode;
    }

    function(ctx: FunctionCstChildren) {
      return {
        type: SearchToken.Function as const,
        name: ctx.Identifier[0]!.image,
        args: (ctx.functionArg || []).map(arg => this.#visit(arg)).filter(arg => !!arg.length),
      } satisfies FunctionAstNode;
    }

    functionArg(ctx: FunctionArgCstChildren) {
      // args: (ctx.args || []).map(arg => this.#visit(arg)),
      return (ctx.args || []).map(arg => this.#visit(arg)) satisfies FunctionArgAstNode;
    }

    filterKey(ctx: FilterKeyCstChildren) {
      return {
        type: SearchToken.FilterKey as const,
        value: ctx.Identifier?.[0]?.image || '',
      } satisfies FilterKeyAstNode;
    }

    filterVal(ctx: FilterValCstChildren) {
      const res = ctx.atomicFilterVal ? this.#visit(ctx.atomicFilterVal) : this.#visit(ctx.filterIn!);

      return res satisfies FilterValAstNode;
    }

    filterIn(ctx: FilterInCstChildren) {
      return {
        type: SearchToken.FilterIn as const,
        values: ctx.atomicFilterVal.map(val => this.#visit(val)),
      } satisfies FilterInAstNode;
    }

    atomicFilterVal(ctx: AtomicFilterValCstChildren) {
      let target = ctx.Identifier?.[0];

      let quoted = false;
      if (ctx.QuotedIdentifier) {
        quoted = true;
        target = ctx.QuotedIdentifier?.[0];
      }

      return {
        type: SearchToken.AtomicFilterVal as const,
        quoted,
        value: target?.image || '',
      } satisfies AtomicFilterValAstNode;
    }

    filterOp(ctx: FilterOpCstChildren) {
      return (ctx.op?.[0]?.image || '=') as FilterOpAstNode;
    }
  }

  return new SearchCstVisitor();
};
