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

/**
 * Object representing an invalid token state.
 *
 * Provide custom types or expectedTypes via the generics.
 */
export interface InvalidToken<T = unknown, ET = unknown> {
  /**
   * The message indicating why the token is invalid
   */
  reason: string;

  /**
   * The invalid reason type
   */
  type: T;

  /**
   * In the case where a filter is invalid, we may be expecting a different
   * type for this filter based on the key. This can be useful to hint to the
   * user what values they should be providing.
   *
   * This may be multiple filter types.
   */
  expectedType?: ET[];
}

interface SearchTokenBase<T = unknown, ET = unknown> {
  invalid?: InvalidToken<T, ET>;
}

export type AnySearchToken<T = unknown, ET = unknown> =
  | SearchQueryAstNode<T, ET>
  | SelectClauseAstNode<T, ET>
  | FromClauseAstNode<T, ET>
  | WhereClauseAstNode<T, ET>
  | QualifierAstNode<T, ET>
  | FunctionAstNode<T, ET>
  | QualifierKeyAstNode<T, ET>
  | QualifierInAstNode<T, ET>
  | RelativeDateValAstNode<T, ET>
  | AtomicQualifierValAstNode<T, ET>;

export interface SearchQueryAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.SearchQuery;
  selectClause: SelectClauseAstNode<T, ET>;
  fromClause: FromClauseAstNode<T, ET>;
  whereClause: WhereClauseAstNode<T, ET>;
}

export interface SelectClauseAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.SelectClause;
  columns: SelectExpressionAstColumns<T, ET>;
}

export type SelectExpressionAstColumns<T = unknown, ET = unknown> = (
  | QualifierAstNode<T, ET>
  | FunctionAstNode<T, ET>
  | AtomicQualifierValAstNode<T, ET>
)[];

export interface FromClauseAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.FromClause;
  table: string;
}

export interface WhereClauseAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.WhereClause;
  conditions: WhereExpressionAstConditions<T, ET>;
}

export type WhereExpressionAstConditions<T = unknown, ET = unknown> = (
  | QualifierAstNode<T, ET>
  | FunctionAstNode<T, ET>
  | AtomicQualifierValAstNode<T, ET>
)[];

export interface QualifierAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.Qualifier;
  negated: boolean;
  lhs: QualifierKeyAstNode<T, ET>;
  op?: QualifierOp;
  rhs?: QualifierRhs<T, ET>;
}

export interface FunctionAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.Function;
  name: string;
  negated: boolean;
  args: FunctionAstArgs<T, ET>[];
  op?: QualifierOp;
  rhs?: QualifierRhs<T, ET>;
}

export type FunctionAstArgs<T = unknown, ET = unknown> = (QualifierAstNode<T, ET> | AtomicQualifierValAstNode<T, ET>)[];

export interface QualifierKeyAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.QualifierKey;
  value: string;
}

export type QualifierRhs<T = unknown, ET = unknown> =
  | QualifierInAstNode<T, ET>
  | AtomicQualifierValAstNode<T, ET>
  | RelativeDateValAstNode<T, ET>;

export interface QualifierInAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.QualifierIn;
  values: AtomicQualifierValAstNode<T, ET>[];
}

export interface RelativeDateValAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.RelativeDateVal;
  value: string;
  sign: '+' | '-';
  unit: 's' | 'mi' | 'h' | 'd' | 'w' | 'm' | 'q' | 'y';
}

export interface TextValAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.TextVal;
  quoted?: boolean;
  value: string;
}

export interface NumberValAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.TextVal;
  value: string;
}

export interface AtomicQualifierValAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.TextVal | SearchToken.NumberVal;
  quoted?: boolean;
  value: string;
}

export type QualifierOp = '=' | '>' | '<' | '>=' | '<=';

export type SearchVisitor = ReturnType<typeof createSearchVisitor>;

const checkNodeType = (node: unknown, type: string): boolean =>
  !!node && typeof node === 'object' && 'type' in node && node.type === type;

export const isQualifierNode = (node: unknown): node is QualifierAstNode => checkNodeType(node, SearchToken.Qualifier);

export const isFunctionNode = (node: unknown): node is FunctionAstNode => checkNodeType(node, SearchToken.Function);

export const isQualifierKeyNode = (node: unknown): node is QualifierKeyAstNode =>
  checkNodeType(node, SearchToken.QualifierKey);

export const isQualifierInNode = (node: unknown): node is QualifierInAstNode =>
  checkNodeType(node, SearchToken.QualifierIn);

export const isAtomicQualifierValNode = (node: unknown): node is AtomicQualifierValAstNode =>
  isTextValNode(node) || isNumberValNode(node);

export const isTextValNode = (node: unknown): node is TextValAstNode => checkNodeType(node, SearchToken.TextVal);

export const isNumberValNode = (node: unknown): node is NumberValAstNode => checkNodeType(node, SearchToken.NumberVal);

let parserSingleton: SearchParser;

interface CreateSearchVisitorOpts {
  transform?: <T extends AnySearchToken>(node: T) => T;
}

export const createSearchVisitor = ({ transform }: CreateSearchVisitorOpts = {}) => {
  function maybeTransform<T extends AnySearchToken>(node: T): T {
    return transform ? transform(node) : node;
  }

  if (!parserSingleton) {
    parserSingleton = new SearchParser();
  }

  const BaseVisitor = parserSingleton.getBaseCstVisitorConstructor();

  /** This simply helps keep this visitor typings tight. Maps CST nodes to AST nodes. */
  type GetReturnType<T> = T extends SearchQueryCstNode
    ? SearchQueryAstNode
    : T extends SelectClauseCstNode | SelectClauseCstNode[]
      ? SelectClauseAstNode
      : T extends FromClauseCstNode | FromClauseCstNode[]
        ? FromClauseAstNode
        : T extends WhereClauseCstNode | WhereClauseCstNode[]
          ? WhereClauseAstNode
          : T extends WhereExpressionCstNode | WhereExpressionCstNode[]
            ? WhereExpressionAstConditions
            : T extends QualifierCstNode | QualifierCstNode[]
              ? QualifierAstNode
              : T extends FunctionCstNode | FunctionCstNode[]
                ? FunctionAstNode
                : T extends FunctionArgCstNode | FunctionArgCstNode[]
                  ? FunctionAstArgs
                  : T extends QualifierKeyCstNode | QualifierKeyCstNode[]
                    ? QualifierKeyAstNode
                    : T extends QualifierValCstNode | QualifierValCstNode[]
                      ? QualifierRhs
                      : T extends QualifierInCstNode | QualifierInCstNode[]
                        ? QualifierInAstNode
                        : T extends RelativeDateValCstNode | RelativeDateValCstNode[]
                          ? RelativeDateValAstNode
                          : T extends AtomicQualifierValCstNode | AtomicQualifierValCstNode[]
                            ? AtomicQualifierValAstNode
                            : T extends QualifierOpCstNode | QualifierOpCstNode[]
                              ? QualifierOp
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
      return maybeTransform({
        type: SearchToken.SearchQuery as const,
        selectClause: this.#visit(ctx.selectClause),
        fromClause: this.#visit(ctx.fromClause),
        whereClause: this.#visit(ctx.whereClause!),
      }) satisfies SearchQueryAstNode;
    }

    selectClause(ctx: SelectClauseCstChildren) {
      return maybeTransform({
        type: SearchToken.SelectClause as const,
        columns: this.#visit(ctx.selectExpression),
      }) satisfies SelectClauseAstNode;
    }

    selectExpression(ctx: SelectExpressionCstChildren) {
      return (ctx.columns || []).map(f => this.#visit(f)) satisfies SelectExpressionAstColumns;
    }

    fromClause(ctx: FromClauseCstChildren) {
      return maybeTransform({
        type: SearchToken.FromClause as const,
        table: ctx.Identifier[0]?.image || '',
      }) satisfies FromClauseAstNode;
    }

    whereClause(ctx: WhereClauseCstChildren) {
      return maybeTransform({
        type: SearchToken.WhereClause as const,
        conditions: this.#visit(ctx.whereExpression),
      }) satisfies WhereClauseAstNode;
    }

    whereExpression(ctx: WhereExpressionCstChildren) {
      return (ctx.conditions || []).map(f => this.#visit(f)) satisfies WhereExpressionAstConditions;
    }

    qualifier(ctx: QualifierCstChildren) {
      return maybeTransform({
        type: SearchToken.Qualifier as const,
        negated: !!ctx.Negate,
        lhs: this.#visit(ctx.lhs!),
        op: ctx.qualifierOp ? this.#visit(ctx.qualifierOp) : undefined,
        rhs: ctx.rhs ? this.#visit(ctx.rhs) : undefined,
      }) satisfies QualifierAstNode;
    }

    function(ctx: FunctionCstChildren) {
      return maybeTransform({
        type: SearchToken.Function as const,
        name: ctx.Identifier[0]!.image,
        negated: !!ctx.Negate,
        args: (ctx.functionArg || []).map(arg => this.#visit(arg)).filter(arg => !!arg.length),
        op: ctx.qualifierOp ? this.#visit(ctx.qualifierOp) : undefined,
        rhs: ctx.rhs ? this.#visit(ctx.rhs) : undefined,
      }) satisfies FunctionAstNode;
    }

    functionArg(ctx: FunctionArgCstChildren) {
      return (ctx.args || []).map(arg => this.#visit(arg)) satisfies FunctionAstArgs;
    }

    qualifierKey(ctx: QualifierKeyCstChildren) {
      return maybeTransform({
        type: SearchToken.QualifierKey as const,
        value: (ctx.QualifierKey?.[0]?.image || '').slice(0, -1), // slice the ":" off
      }) satisfies QualifierKeyAstNode;
    }

    qualifierVal(ctx: QualifierValCstChildren) {
      if (!ctx.val) return undefined;

      return maybeTransform(this.#visit(ctx.val)) satisfies QualifierRhs;
    }

    qualifierIn(ctx: QualifierInCstChildren) {
      return maybeTransform({
        type: SearchToken.QualifierIn as const,
        values: ctx.atomicQualifierVal.map(val => this.#visit(val)),
      }) satisfies QualifierInAstNode;
    }

    relativeDateVal(ctx: RelativeDateValCstChildren) {
      return maybeTransform({
        type: SearchToken.RelativeDateVal as const,
        value: ctx.Number?.[0]?.image || '',
        sign: ctx.op?.[0]?.image as RelativeDateValAstNode['sign'],
        unit: ctx.DateUnit?.[0]?.image as RelativeDateValAstNode['unit'],
      }) satisfies RelativeDateValAstNode;
    }

    atomicQualifierVal(ctx: AtomicQualifierValCstChildren) {
      const type = ctx.Number ? SearchToken.NumberVal : SearchToken.TextVal;
      let target = ctx.Identifier?.[0] || ctx.Number?.[0];

      let quoted = false;
      if (ctx.QuotedIdentifier) {
        quoted = true;
        target = ctx.QuotedIdentifier?.[0];
      }

      return maybeTransform({
        type,
        quoted,
        value: target?.image || '',
      }) satisfies AtomicQualifierValAstNode;
    }

    qualifierOp(ctx: QualifierOpCstChildren) {
      return (ctx.op?.[0]?.image || '') as QualifierOp;
    }
  }

  return new SearchCstVisitor();
};
