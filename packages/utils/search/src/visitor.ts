import type { CstNode } from 'chevrotain';

import { SearchParser } from './grammar/parser.ts';
import type {
  AtomicQualifierValCstChildren,
  AtomicQualifierValCstNode,
  FromClauseCstChildren,
  FromClauseCstNode,
  FunctionArgCstChildren,
  FunctionArgCstNode,
  FunctionCstChildren,
  FunctionCstNode,
  QualifierCstChildren,
  QualifierCstNode,
  QualifierInCstChildren,
  QualifierInCstNode,
  QualifierKeyCstChildren,
  QualifierKeyCstNode,
  QualifierOpCstChildren,
  QualifierOpCstNode,
  QualifierValCstChildren,
  QualifierValCstNode,
  RelativeDateValCstChildren,
  RelativeDateValCstNode,
  SearchQueryCstChildren,
  SearchQueryCstNode,
  SelectClauseCstChildren,
  SelectClauseCstNode,
  SelectExpressionCstChildren,
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
  Qualifier = 'qualifier',
  Function = 'function',
  QualifierKey = 'qualifierKey',
  QualifierIn = 'qualifierIn',
  RelativeDateVal = 'relativeDateVal',
  TextVal = 'textVal',
  NumberVal = 'numberVal',
}

export type AnySearchToken =
  | SearchQueryAstNode
  | SelectClauseAstNode
  | FromClauseAstNode
  | WhereClauseAstNode
  | QualifierAstNode
  | FunctionAstNode
  | QualifierKeyAstNode
  | QualifierInAstNode
  | RelativeDateValAstNode
  | AtomicQualifierValAstNode;

export interface SearchQueryAstNode {
  type: SearchToken.SearchQuery;
  selectClause: SelectClauseAstNode;
  fromClause: FromClauseAstNode;
  whereClause: WhereClauseAstNode;
}

export interface SelectClauseAstNode {
  type: SearchToken.SelectClause;
  columns: SelectExpressionAstNode;
}

export type SelectExpressionAstNode = (QualifierAstNode | AtomicQualifierValAstNode)[];

export interface FromClauseAstNode {
  type: SearchToken.FromClause;
  table: string;
}

export interface WhereClauseAstNode {
  type: SearchToken.WhereClause;
  conditions: WhereExpressionAstNode;
}

export type WhereExpressionAstNode = (QualifierAstNode | AtomicQualifierValAstNode)[];

export interface QualifierAstNode {
  type: SearchToken.Qualifier;
  negated: boolean;
  lhs: FunctionAstNode | QualifierKeyAstNode;
  op?: QualifierOpAstNode;
  rhs?: QualifierValAstNode;
}

export interface FunctionAstNode {
  type: SearchToken.Function;
  name: string;
  args: FunctionArgAstNode[];
}

export type FunctionArgAstNode = (QualifierAstNode | AtomicQualifierValAstNode)[];

export interface QualifierKeyAstNode {
  type: SearchToken.QualifierKey;
  value: string;
}

export type QualifierValAstNode = QualifierInAstNode | AtomicQualifierValAstNode | RelativeDateValAstNode;

export interface QualifierInAstNode {
  type: SearchToken.QualifierIn;
  values: AtomicQualifierValAstNode[];
}

export interface RelativeDateValAstNode {
  type: SearchToken.RelativeDateVal;
  value: string;
  sign: '+' | '-';
  unit: 's' | 'mi' | 'h' | 'd' | 'w' | 'm' | 'q' | 'y';
}

export interface AtomicQualifierValAstNode {
  type: SearchToken.TextVal | SearchToken.NumberVal;
  quoted;
  value: string;
}

export type QualifierOpAstNode = '=' | '>' | '<' | '>=' | '<=';

export type SearchVisitor = ReturnType<typeof createSearchVisitor>;

const checkNodeType = (node: unknown, type: string): boolean =>
  !!node && typeof node === 'object' && 'type' in node && node.type === type;

export const isQualifierNode = (node: unknown): node is QualifierAstNode => checkNodeType(node, SearchToken.Qualifier);

export const isFunctionNode = (node: unknown): node is FunctionAstNode => checkNodeType(node, SearchToken.Function);

export const isQualifierKeyAstNode = (node: unknown): node is QualifierKeyAstNode =>
  checkNodeType(node, SearchToken.QualifierKey);

export const isQualifierInAstNode = (node: unknown): node is QualifierInAstNode =>
  checkNodeType(node, SearchToken.QualifierIn);

export const isAtomicQualifierValAstNode = (node: unknown): node is AtomicQualifierValAstNode =>
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
            : T extends QualifierCstNode
              ? QualifierAstNode
              : T extends FunctionCstNode
                ? FunctionAstNode
                : T extends FunctionArgCstNode
                  ? FunctionArgAstNode
                  : T extends QualifierKeyCstNode
                    ? QualifierKeyAstNode
                    : T extends QualifierValCstNode
                      ? QualifierValAstNode
                      : T extends QualifierInCstNode
                        ? QualifierInAstNode
                        : T extends RelativeDateValCstNode
                          ? RelativeDateValAstNode
                          : T extends AtomicQualifierValCstNode
                            ? AtomicQualifierValAstNode
                            : T extends QualifierOpCstNode
                              ? QualifierOpAstNode
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
        columns: this.#visit(ctx.selectExpression),
      } satisfies SelectClauseAstNode;
    }

    selectExpression(ctx: SelectExpressionCstChildren) {
      return (ctx.columns || []).map(f => this.#visit(f)) satisfies SelectExpressionAstNode;
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

    qualifier(ctx: QualifierCstChildren) {
      return {
        type: SearchToken.Qualifier as const,
        negated: !!ctx.Negate,
        lhs: this.#visit(ctx.lhs!),
        op: this.#visit(ctx.qualifierOp),
        rhs: this.#visit(ctx.rhs),
      } satisfies QualifierAstNode;
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

    qualifierKey(ctx: QualifierKeyCstChildren) {
      return {
        type: SearchToken.QualifierKey as const,
        value: ctx.Identifier?.[0]?.image || '',
      } satisfies QualifierKeyAstNode;
    }

    qualifierVal(ctx: QualifierValCstChildren) {
      if (!ctx.val) return undefined;

      return this.#visit(ctx.val) satisfies QualifierValAstNode;
    }

    qualifierIn(ctx: QualifierInCstChildren) {
      return {
        type: SearchToken.QualifierIn as const,
        values: ctx.atomicQualifierVal.map(val => this.#visit(val)),
      } satisfies QualifierInAstNode;
    }

    relativeDateVal(ctx: RelativeDateValCstChildren) {
      return {
        type: SearchToken.RelativeDateVal as const,
        value: ctx.Number?.[0]?.image || '',
        sign: ctx.op?.[0]?.image as RelativeDateValAstNode['sign'],
        unit: ctx.DateUnit?.[0]?.image as RelativeDateValAstNode['unit'],
      } satisfies RelativeDateValAstNode;
    }

    atomicQualifierVal(ctx: AtomicQualifierValCstChildren) {
      const type = ctx.Number ? SearchToken.NumberVal : SearchToken.TextVal;
      let target = ctx.Identifier?.[0] || ctx.Number?.[0];

      let quoted = false;
      if (ctx.QuotedIdentifier) {
        quoted = true;
        target = ctx.QuotedIdentifier?.[0];
      }

      return {
        type,
        quoted,
        value: target?.image || '',
      } satisfies AtomicQualifierValAstNode;
    }

    qualifierOp(ctx: QualifierOpCstChildren) {
      return (ctx.op?.[0]?.image || '') as QualifierOpAstNode;
    }
  }

  return new SearchCstVisitor();
};
