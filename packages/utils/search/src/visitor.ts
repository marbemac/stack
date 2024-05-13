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
import type { RelativeDateTokenPayload } from './grammar/tokens.ts';

export const enum SearchToken {
  SearchQuery = 'searchQuery',
  SelectClause = 'selectClause',
  SelectExpression = 'selectExpression',
  FromClause = 'fromClause',
  WhereClause = 'whereClause',
  WhereExpression = 'whereExpression',
  Qualifier = 'qualifier',
  Function = 'function',
  FunctionArg = 'functionArg',
  QualifierKey = 'qualifierKey',
  QualifierIn = 'qualifierIn',
  RelativeDateVal = 'relativeDateVal',
  TextVal = 'textVal',
  NumberVal = 'numberVal',
  BooleanVal = 'booleanVal',
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
  | FunctionArgAstNode<T, ET>
  | QualifierKeyAstNode<T, ET>
  | QualifierInAstNode<T, ET>
  | RelativeDateValAstNode<T, ET>
  | TextValAstNode<T, ET>
  | NumberValAstNode<T, ET>
  | BooleanValAstNode<T, ET>;

export interface SearchQueryAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.SearchQuery;
  fromClause: FromClauseAstNode<T, ET>;
  selectClause?: SelectClauseAstNode<T, ET>;
  whereClause?: WhereClauseAstNode<T, ET>;
}

export interface SelectClauseAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.SelectClause;
  columns: SelectExpressionAstColumns<T, ET>;
}

export type SelectExpressionAstColumns<T = unknown, ET = unknown> = (
  | QualifierAstNode<T, ET>
  | FunctionAstNode<T, ET>
  | AtomicQualifierVal<T, ET>
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
  | AtomicQualifierVal<T, ET>
)[];

export interface QualifierAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.Qualifier;
  negated: boolean;
  lhs: QualifierKeyAstNode<T, ET>;
  op?: QualifierOp;
  rhs?: QualifierVal<T, ET>;
}

export interface FunctionAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.Function;
  name: string;
  negated: boolean;
  args: FunctionArgAstNode<T, ET>[];
  op?: QualifierOp;
  rhs?: QualifierVal<T, ET>;
}

export interface FunctionArgAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.FunctionArg;
  position: number;
  vals: (QualifierAstNode<T, ET> | AtomicQualifierVal<T, ET>)[];
}

export interface QualifierKeyAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.QualifierKey;
  value: string;
}

export type QualifierVal<T = unknown, ET = unknown> =
  | QualifierInAstNode<T, ET>
  | AtomicQualifierVal<T, ET>
  | RelativeDateValAstNode<T, ET>;

export interface QualifierInAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.QualifierIn;
  values: AtomicQualifierVal<T, ET>[];
}

export interface RelativeDateValAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.RelativeDateVal;
  value: string;
  parsed: number;
  sign: RelativeDateTokenPayload['sign'];
  unit: RelativeDateTokenPayload['unit'];
}

export interface TextValAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.TextVal;
  quoted?: boolean;
  value: string;
}

export interface NumberValAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.NumberVal;
  value: string;
  parsed: number;
}

export interface BooleanValAstNode<T = unknown, ET = unknown> extends SearchTokenBase<T, ET> {
  type: SearchToken.BooleanVal;
  value: string;
  parsed: boolean;
}

export type AtomicQualifierVal<T = unknown, ET = unknown> =
  | TextValAstNode<T, ET>
  | NumberValAstNode<T, ET>
  | BooleanValAstNode<T, ET>;

export type QualifierOp = '=' | '>' | '<' | '>=' | '<=';

export type SearchVisitor = ReturnType<typeof createSearchVisitor>;

let parserSingleton: SearchParser;

/**
 * For some nodes, it is useful to expose some of the (shallow) data associated with the node to the
 * enter/exit hooks. This is a mapping of the token type to the data that is available.
 */
export interface OnEnterExitDataMap {
  [SearchToken.SearchQuery]: {};
  [SearchToken.SelectClause]: {};
  [SearchToken.SelectExpression]: {};
  [SearchToken.FromClause]: {};
  [SearchToken.WhereClause]: {};
  [SearchToken.WhereExpression]: {};
  [SearchToken.Qualifier]: {};
  [SearchToken.Function]: Pick<FunctionAstNode, 'name'>;
  [SearchToken.FunctionArg]: Pick<FunctionArgAstNode, 'position'>;
  [SearchToken.QualifierKey]: {};
  [SearchToken.QualifierIn]: {};
  [SearchToken.RelativeDateVal]: {};
  [SearchToken.TextVal]: {};
  [SearchToken.NumberVal]: {};
  [SearchToken.BooleanVal]: {};
}

interface CreateSearchVisitorOpts {
  onEnter?: <T extends SearchToken>(type: T, data: OnEnterExitDataMap[T]) => void;
  onExit?: <T extends SearchToken>(type: T, data: OnEnterExitDataMap[T]) => void;
  transform?: <T extends AnySearchToken>(node: T) => T;
}

export const createSearchVisitor = ({ onEnter, onExit, transform }: CreateSearchVisitorOpts = {}) => {
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
                  ? FunctionArgAstNode
                  : T extends QualifierKeyCstNode | QualifierKeyCstNode[]
                    ? QualifierKeyAstNode
                    : T extends QualifierValCstNode | QualifierValCstNode[]
                      ? QualifierVal
                      : T extends QualifierInCstNode | QualifierInCstNode[]
                        ? QualifierInAstNode
                        : T extends RelativeDateValCstNode | RelativeDateValCstNode[]
                          ? RelativeDateValAstNode
                          : T extends AtomicQualifierValCstNode | AtomicQualifierValCstNode[]
                            ? AtomicQualifierVal
                            : T extends QualifierOpCstNode | QualifierOpCstNode[]
                              ? QualifierOp
                              : never;

  type VisitFn = <T extends CstNode | CstNode[]>(cstNode: T, param?: unknown) => GetReturnType<T>;

  class SearchVisitor extends BaseVisitor implements TSearchCstVisitor<unknown, unknown> {
    #visit: VisitFn;

    constructor() {
      super();
      this.#visit = this.visit as VisitFn;
      this.validateVisitor();
    }

    searchQuery(ctx: SearchQueryCstChildren) {
      onEnter?.(SearchToken.SearchQuery, {});

      const t = maybeTransform({
        type: SearchToken.SearchQuery as const,
        /**
         * Important that we visit from first!
         *
         * This helps with the use case where the "from" context is relevant
         * to the visiting of the subsequent clauses.
         */
        fromClause: this.#visit(ctx.fromClause),
        selectClause: this.#visit(ctx.selectClause!),
        whereClause: this.#visit(ctx.whereClause!),
      }) satisfies SearchQueryAstNode;

      onExit?.(SearchToken.SearchQuery, {});

      return t;
    }

    fromClause(ctx: FromClauseCstChildren) {
      onEnter?.(SearchToken.FromClause, {});

      const t = maybeTransform({
        type: SearchToken.FromClause as const,
        table: ctx.Identifier[0]?.image || '',
      }) satisfies FromClauseAstNode;

      onExit?.(SearchToken.FromClause, {});

      return t;
    }

    selectClause(ctx: SelectClauseCstChildren) {
      onEnter?.(SearchToken.SelectClause, {});

      const t = maybeTransform({
        type: SearchToken.SelectClause as const,
        columns: this.#visit(ctx.selectExpression),
      }) satisfies SelectClauseAstNode;

      onExit?.(SearchToken.SelectClause, {});

      return t;
    }

    selectExpression(ctx: SelectExpressionCstChildren) {
      onEnter?.(SearchToken.SelectExpression, {});

      const t = (ctx.columns || []).map(f => this.#visit(f)) satisfies SelectExpressionAstColumns;

      onExit?.(SearchToken.SelectExpression, {});

      return t;
    }

    whereClause(ctx: WhereClauseCstChildren) {
      onEnter?.(SearchToken.WhereClause, {});

      const t = maybeTransform({
        type: SearchToken.WhereClause as const,
        conditions: this.#visit(ctx.whereExpression),
      }) satisfies WhereClauseAstNode;

      onExit?.(SearchToken.WhereClause, {});

      return t;
    }

    whereExpression(ctx: WhereExpressionCstChildren) {
      onEnter?.(SearchToken.WhereExpression, {});

      const t = (ctx.conditions || []).map(f => this.#visit(f)) satisfies WhereExpressionAstConditions;

      onExit?.(SearchToken.WhereExpression, {});

      return t;
    }

    qualifier(ctx: QualifierCstChildren) {
      onEnter?.(SearchToken.Qualifier, {});

      const t = maybeTransform({
        type: SearchToken.Qualifier as const,
        negated: !!ctx.Negate,
        lhs: this.#visit(ctx.lhs!),
        op: ctx.qualifierOp ? this.#visit(ctx.qualifierOp) : undefined,
        rhs: ctx.rhs ? this.#visit(ctx.rhs) : undefined,
      }) satisfies QualifierAstNode;

      onExit?.(SearchToken.Qualifier, {});

      return t;
    }

    function(ctx: FunctionCstChildren) {
      const name = ctx.Identifier[0]!.image;

      onEnter?.(SearchToken.Function, { name });

      const t = maybeTransform({
        type: SearchToken.Function as const,
        name,
        negated: !!ctx.Negate,
        args: (ctx.functionArg || []).map((arg, i) => this.#visit(arg, { position: i })).filter(a => !!a.vals.length),
        op: ctx.qualifierOp ? this.#visit(ctx.qualifierOp) : undefined,
        rhs: ctx.rhs ? this.#visit(ctx.rhs) : undefined,
      }) satisfies FunctionAstNode;

      onExit?.(SearchToken.Function, { name });

      return t;
    }

    functionArg(ctx: FunctionArgCstChildren, { position }: { position: number }) {
      onEnter?.(SearchToken.FunctionArg, { position });

      const t = maybeTransform({
        type: SearchToken.FunctionArg as const,
        position,
        vals: (ctx.args || []).map(arg => this.#visit(arg)),
      }) satisfies FunctionArgAstNode;

      onExit?.(SearchToken.FunctionArg, { position });

      return t;
    }

    qualifierKey(ctx: QualifierKeyCstChildren) {
      onEnter?.(SearchToken.QualifierKey, {});

      const t = maybeTransform({
        type: SearchToken.QualifierKey as const,
        value: (ctx.QualifierKey?.[0]?.image || '').slice(0, -1), // slice the ":" off
      }) satisfies QualifierKeyAstNode;

      onExit?.(SearchToken.QualifierKey, {});

      return t;
    }

    qualifierVal(ctx: QualifierValCstChildren) {
      const val = ctx.val?.[0];
      if (!val) return undefined;

      return this.#visit(val) satisfies QualifierVal;
    }

    qualifierIn(ctx: QualifierInCstChildren) {
      onEnter?.(SearchToken.QualifierIn, {});

      const t = maybeTransform({
        type: SearchToken.QualifierIn as const,
        values: ctx.atomicQualifierVal.map(val => this.#visit(val)),
      }) satisfies QualifierInAstNode;

      onExit?.(SearchToken.QualifierIn, {});

      return t;
    }

    relativeDateVal(ctx: RelativeDateValCstChildren) {
      onEnter?.(SearchToken.RelativeDateVal, {});

      const { sign, unit, value } = ctx.RelativeDate[0]?.payload as RelativeDateTokenPayload;

      const parsed = parseFloat(value);

      const t = maybeTransform({
        type: SearchToken.RelativeDateVal as const,
        sign,
        unit,
        value,
        parsed,
      }) satisfies RelativeDateValAstNode;

      onExit?.(SearchToken.RelativeDateVal, {});

      return t;
    }

    atomicQualifierVal(ctx: AtomicQualifierValCstChildren) {
      if (ctx.Number) {
        onEnter?.(SearchToken.NumberVal, {});

        const value = ctx.Number?.[0]?.image || '';
        const parsed = parseFloat(value);

        const t = maybeTransform({
          type: SearchToken.NumberVal,
          value,
          parsed,
        }) satisfies NumberValAstNode;

        onExit?.(SearchToken.NumberVal, {});

        return t;
      }

      if (ctx.Boolean) {
        onEnter?.(SearchToken.BooleanVal, {});

        const value = ctx.Boolean?.[0]?.image || '';
        const parsed = JSON.parse(value) as boolean;

        const t = maybeTransform({
          type: SearchToken.BooleanVal,
          value,
          parsed,
        }) satisfies BooleanValAstNode;

        onExit?.(SearchToken.BooleanVal, {});

        return t;
      }

      onEnter?.(SearchToken.TextVal, {});

      const t = maybeTransform({
        type: SearchToken.TextVal,
        quoted: ctx.QuotedIdentifier?.[0] ? true : false,
        value: (ctx.QuotedIdentifier?.[0] || ctx.Identifier?.[0])?.image || '',
      }) satisfies TextValAstNode;

      onExit?.(SearchToken.TextVal, {});

      return t;
    }

    qualifierOp(ctx: QualifierOpCstChildren) {
      return (ctx.op?.[0]?.image || '') as QualifierOp;
    }
  }

  return new SearchVisitor();
};
