import type { CstNode } from 'chevrotain';

import { SearchParser } from './grammar/parser.ts';
import type {
  AtomicQualifierValCstChildren,
  AtomicQualifierValCstNode,
  BracketListCstChildren,
  BracketListCstNode,
  FromClauseCstChildren,
  FromClauseCstNode,
  FunctionArgCstChildren,
  FunctionArgCstNode,
  FunctionCstChildren,
  FunctionCstNode,
  QualifierCstChildren,
  QualifierCstNode,
  QualifierKeyCstChildren,
  QualifierKeyCstNode,
  QualifierOpCstChildren,
  QualifierOpCstNode,
  QualifierValCstChildren,
  QualifierValCstNode,
  SearchQueryCstChildren,
  SearchQueryCstNode,
  SelectClauseCstChildren,
  SelectClauseCstNode,
  SelectExprCstChildren,
  SortDirCstChildren,
  TSearchCstVisitor,
  WhereClauseCstChildren,
  WhereClauseCstNode,
  WhereExprCstChildren,
  WhereExprCstNode,
} from './grammar/parser-cst-types.ts';
import type { RelativeDateTokenPayload } from './grammar/tokens.ts';

/**
 * Object representing an invalid token state.
 */
export interface InvalidSearchNode {
  /**
   * The message indicating why the token is invalid
   */
  reason: string;

  /**
   * The invalid reason type
   */
  type: string;
}

interface SearchNodeBase {
  invalid?: InvalidSearchNode;

  /**
   * Returns true if this node, or any children of this node, are invalid.
   */
  isBranchInvalid: boolean;
}

export type SearchNode =
  | SearchQueryAstNode
  | SelectClauseAstNode
  | SelectExprAstNode
  | FromClauseAstNode
  | WhereClauseAstNode
  | WhereExprAstNode
  | QualifierAstNode
  | FunctionAstNode
  | FunctionArgAstNode
  | QualifierKeyAstNode
  | BracketListAstNode
  | RelativeDateAstNode
  | TextAstNode
  | NumberAstNode
  | BooleanAstNode
  | Iso8601DateAstNode;

export type SearchNodeType = SearchNode['type'];

export interface IsSortableNode {
  sort?: SortDir;
}

export interface IsNegatableNode {
  negated: boolean;
}

export interface SearchQueryAstNode extends SearchNodeBase {
  type: 'search_query';
  fromClause: FromClauseAstNode;
  selectClause?: SelectClauseAstNode;
  whereClause?: WhereClauseAstNode;
}

export interface SelectClauseAstNode extends SearchNodeBase {
  type: 'select_clause';
  expr: SelectExprAstNode;
}

export interface SelectExprAstNode extends SearchNodeBase {
  type: 'select_expr';
  columns: (QualifierAstNode | FunctionAstNode | AtomicQualifierVal)[];
}

export interface FromClauseAstNode extends SearchNodeBase {
  type: 'from_clause';
  table: string;
}

export interface WhereClauseAstNode extends SearchNodeBase {
  type: 'where_clause';
  expr: WhereExprAstNode;
}

export interface WhereExprAstNode extends SearchNodeBase {
  type: 'where_expr';
  conditions: (QualifierAstNode | FunctionAstNode | AtomicQualifierVal)[];
}

export interface QualifierAstNode extends SearchNodeBase, IsNegatableNode {
  type: 'qualifier';
  lhs: QualifierKeyAstNode;
  op?: QualifierOp | '';
  rhs?: QualifierVal;
}

export interface FunctionAstNode extends SearchNodeBase, IsNegatableNode, IsSortableNode {
  type: 'function';
  name: string;
  args: FunctionArgAstNode[];
  op?: QualifierOp | '';
  rhs?: QualifierVal;
}

export interface FunctionArgAstNode extends SearchNodeBase {
  type: 'function_arg';
  position: number;
  vals: (QualifierAstNode | AtomicQualifierVal)[];
}

export interface QualifierKeyAstNode extends SearchNodeBase {
  type: 'qualifier_key';
  value: string;
}

export type QualifierVal = BracketListAstNode | AtomicQualifierVal;

export interface BracketListAstNode extends SearchNodeBase {
  type: 'bracket_list';
  values: AtomicQualifierVal[];
}

export interface RelativeDateAstNode extends SearchNodeBase {
  type: 'relative_date';
  value: string;
  parsed: number;
  sign: RelativeDateTokenPayload['sign'];
  unit: RelativeDateTokenPayload['unit'];
}

export interface Iso8601DateAstNode extends SearchNodeBase {
  type: 'iso_8601_date';
  value: string;
}

export interface TextAstNode extends SearchNodeBase, IsSortableNode {
  type: 'text';
  quoted?: boolean;
  value: string;
}

export interface NumberAstNode extends SearchNodeBase {
  type: 'number';
  value: string;
  parsed: number;
}

export interface BooleanAstNode extends SearchNodeBase {
  type: 'boolean';
  value: string;
  parsed: boolean;
}

export type AtomicQualifierVal =
  | TextAstNode
  | NumberAstNode
  | BooleanAstNode
  | Iso8601DateAstNode
  | RelativeDateAstNode;

export type QualifierOp = '=' | '>' | '<' | '>=' | '<=';

export type SortDir = 'asc' | 'desc';

export type SearchVisitor = ReturnType<typeof createSearchVisitor>;

let parserSingleton: SearchParser;

/**
 * For some nodes, it is useful to expose some of the (shallow) data associated with the node to the
 * enter/exit hooks. This is a mapping of the token type to the data that is available.
 */
export type OnEnterDataMap =
  | {
      type: 'search_query';
    }
  | {
      type: 'select_clause';
    }
  | {
      type: 'select_expr';
    }
  | {
      type: 'from_clause';
      table: string;
    }
  | {
      type: 'where_clause';
    }
  | {
      type: 'where_expr';
    }
  | {
      type: 'qualifier';
    }
  | {
      type: 'function';
      name: string;
    }
  | {
      type: 'function_arg';
      position: number;
    }
  | {
      type: 'qualifier_key';
      value: string;
    }
  | {
      type: 'bracket_list';
    }
  | {
      type: 'relative_date';
    }
  | {
      type: 'text';
    }
  | {
      type: 'number';
    }
  | {
      type: 'boolean';
    }
  | {
      type: 'iso_8601_date';
    };

interface CreateSearchVisitorOpts {
  onEnter?: (data: OnEnterDataMap) => void;
  onExit?: (data: SearchNode) => void;
  transform?: <T extends SearchNode>(node: T) => T;
}

export const createSearchVisitor = ({ onEnter, onExit, transform }: CreateSearchVisitorOpts = {}) => {
  function maybeTransform<T extends SearchNode>(node: T): T {
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
          : T extends WhereExprCstNode | WhereExprCstNode[]
            ? WhereExprAstNode
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
                      : T extends BracketListCstNode | BracketListCstNode[]
                        ? BracketListAstNode
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
      onEnter?.({ type: 'search_query' });

      const t = maybeTransform({
        type: 'search_query',
        /**
         * Important that we visit from first!
         *
         * This helps with the use case where the "from" context is relevant
         * to the visiting of the subsequent clauses.
         */
        fromClause: this.#visit(ctx.fromClause),
        selectClause: this.#visit(ctx.selectClause!),
        whereClause: this.#visit(ctx.whereClause!),
        get isBranchInvalid() {
          const $ = this as SearchQueryAstNode;
          return (
            !!$.invalid ||
            !!$.fromClause.isBranchInvalid ||
            !!$.selectClause?.isBranchInvalid ||
            !!$.whereClause?.isBranchInvalid
          );
        },
      }) satisfies SearchQueryAstNode;

      onExit?.(t);

      return t;
    }

    fromClause(ctx: FromClauseCstChildren) {
      const table = ctx.Identifier[0]?.image || '';

      onEnter?.({ type: 'from_clause', table });

      const t = maybeTransform({
        type: 'from_clause',
        table,
        get isBranchInvalid() {
          const $ = this as FromClauseAstNode;
          return !!$.invalid;
        },
      }) satisfies FromClauseAstNode;

      onExit?.(t);

      return t;
    }

    selectClause(ctx: SelectClauseCstChildren) {
      onEnter?.({ type: 'select_clause' });

      const t = maybeTransform({
        type: 'select_clause',
        expr: this.#visit(ctx.selectExpr),
        get isBranchInvalid() {
          const $ = this as SelectClauseAstNode;
          return !!$.invalid || $.expr.isBranchInvalid;
        },
      }) satisfies SelectClauseAstNode;

      onExit?.(t);

      return t;
    }

    selectExpr(ctx: SelectExprCstChildren) {
      onEnter?.({ type: 'select_expr' });

      const t = maybeTransform({
        type: 'select_expr',
        columns: (ctx.columns || []).map(f => this.#visit(f)),
        get isBranchInvalid() {
          const $ = this as SelectExprAstNode;
          return !!$.invalid || $.columns.some(c => c.isBranchInvalid);
        },
      }) satisfies SelectExprAstNode;

      onExit?.(t);

      return t;
    }

    whereClause(ctx: WhereClauseCstChildren) {
      onEnter?.({ type: 'where_clause' });

      const t = maybeTransform({
        type: 'where_clause',
        expr: this.#visit(ctx.whereExpr),
        get isBranchInvalid() {
          const $ = this as WhereClauseAstNode;
          return !!$.invalid || $.expr.isBranchInvalid;
        },
      }) satisfies WhereClauseAstNode;

      onExit?.(t);

      return t;
    }

    whereExpr(ctx: WhereExprCstChildren) {
      onEnter?.({ type: 'where_expr' });

      const t = maybeTransform({
        type: 'where_expr',
        conditions: (ctx.conditions || []).map(f => this.#visit(f)),
        get isBranchInvalid() {
          const $ = this as WhereExprAstNode;
          return !!$.invalid || $.conditions.some(c => c.isBranchInvalid);
        },
      }) satisfies WhereExprAstNode;

      onExit?.(t);

      return t;
    }

    qualifier(ctx: QualifierCstChildren) {
      onEnter?.({ type: 'qualifier' });

      const t = maybeTransform({
        type: 'qualifier',
        negated: !!ctx.Negate,
        lhs: this.#visit(ctx.lhs!),
        op: ctx.qualifierOp ? this.#visit(ctx.qualifierOp) : undefined,
        rhs: ctx.rhs ? this.#visit(ctx.rhs) : undefined,
        get isBranchInvalid() {
          const $ = this as QualifierAstNode;
          return !!$.invalid || $.lhs.isBranchInvalid || !!$.rhs?.isBranchInvalid;
        },
      }) satisfies QualifierAstNode;

      onExit?.(t);

      return t;
    }

    function(ctx: FunctionCstChildren) {
      const name = ctx.Identifier[0]!.image;

      onEnter?.({ type: 'function', name });

      const t = maybeTransform({
        type: 'function',
        name,
        negated: !!ctx.Negate,
        args: (ctx.functionArg || []).map((arg, i) => this.#visit(arg, { position: i })).filter(a => !!a.vals.length),
        sort: ctx.sortDir ? this.#visit(ctx.sortDir) : undefined,
        op: ctx.qualifierOp ? this.#visit(ctx.qualifierOp) : undefined,
        rhs: ctx.rhs ? this.#visit(ctx.rhs) : undefined,
        get isBranchInvalid() {
          const $ = this as FunctionAstNode;
          return !!$.invalid || !!$.rhs?.isBranchInvalid || $.args.some(a => a.isBranchInvalid);
        },
      }) satisfies FunctionAstNode;

      onExit?.(t);

      return t;
    }

    functionArg(ctx: FunctionArgCstChildren, { position }: { position: number }) {
      onEnter?.({ type: 'function_arg', position });

      const t = maybeTransform({
        type: 'function_arg',
        position,
        vals: (ctx.args || []).map(arg => this.#visit(arg)),
        get isBranchInvalid() {
          const $ = this as FunctionArgAstNode;
          return !!$.invalid || $.vals.some(a => a.isBranchInvalid);
        },
      }) satisfies FunctionArgAstNode;

      onExit?.(t);

      return t;
    }

    qualifierKey(ctx: QualifierKeyCstChildren) {
      const value = (ctx.QualifierKey?.[0]?.image || '').slice(0, -1); // slice the ":" off

      onEnter?.({ type: 'qualifier_key', value });

      const t = maybeTransform({
        type: 'qualifier_key',
        value,
        get isBranchInvalid() {
          const $ = this as QualifierKeyAstNode;
          return !!$.invalid;
        },
      }) satisfies QualifierKeyAstNode;

      onExit?.(t);

      return t;
    }

    qualifierVal(ctx: QualifierValCstChildren) {
      const val = ctx.val?.[0];
      if (!val) return undefined;

      return this.#visit(val) satisfies QualifierVal;
    }

    bracketList(ctx: BracketListCstChildren) {
      onEnter?.({ type: 'bracket_list' });

      const t = maybeTransform({
        type: 'bracket_list',
        values: ctx.atomicQualifierVal.map(val => this.#visit(val)),
        get isBranchInvalid() {
          const $ = this as BracketListAstNode;
          return !!$.invalid || $.values.some(v => v.isBranchInvalid);
        },
      }) satisfies BracketListAstNode;

      onExit?.(t);

      return t;
    }

    atomicQualifierVal(ctx: AtomicQualifierValCstChildren) {
      if (ctx.Number) {
        onEnter?.({ type: 'number' });

        const value = ctx.Number?.[0]?.image || '';
        const parsed = parseFloat(value);

        const t = maybeTransform({
          type: 'number',
          value,
          parsed,
          get isBranchInvalid() {
            const $ = this as NumberAstNode;
            return !!$.invalid;
          },
        }) satisfies NumberAstNode;

        onExit?.(t);

        return t;
      }

      if (ctx.Boolean) {
        onEnter?.({ type: 'boolean' });

        const value = ctx.Boolean?.[0]?.image || '';
        const parsed = JSON.parse(value) as boolean;

        const t = maybeTransform({
          type: 'boolean',
          value,
          parsed,
          get isBranchInvalid() {
            const $ = this as BooleanAstNode;
            return !!$.invalid;
          },
        }) satisfies BooleanAstNode;

        onExit?.(t);

        return t;
      }

      if (ctx.RelativeDate) {
        onEnter?.({ type: 'relative_date' });

        const { sign, unit, value } = ctx.RelativeDate[0]?.payload as RelativeDateTokenPayload;

        const parsed = parseFloat(value);

        const t = maybeTransform({
          type: 'relative_date',
          sign,
          unit,
          value,
          parsed,
          get isBranchInvalid() {
            const $ = this as RelativeDateAstNode;
            return !!$.invalid;
          },
        }) satisfies RelativeDateAstNode;

        onExit?.(t);

        return t;
      }

      if (ctx.Iso8601Date) {
        onEnter?.({ type: 'iso_8601_date' });

        const value = ctx.Iso8601Date?.[0]?.image || '';

        const t = maybeTransform({
          type: 'iso_8601_date',
          value,
          get isBranchInvalid() {
            const $ = this as Iso8601DateAstNode;
            return !!$.invalid;
          },
        }) satisfies Iso8601DateAstNode;

        onExit?.(t);

        return t;
      }

      onEnter?.({ type: 'text' });

      const t = maybeTransform({
        type: 'text',
        quoted: ctx.QuotedIdentifier?.[0] ? true : false,
        value: (ctx.QuotedIdentifier?.[0] || ctx.Identifier?.[0])?.image || '',
        sort: ctx.sortDir ? this.#visit(ctx.sortDir) : undefined,
        get isBranchInvalid() {
          const $ = this as TextAstNode;
          return !!$.invalid;
        },
      }) satisfies TextAstNode;

      onExit?.(t);

      return t;
    }

    sortDir(ctx: SortDirCstChildren) {
      const dir = ctx.dir?.[0]?.image;
      if (!dir) return;

      return dir === '+' ? 'asc' : 'desc';
    }

    qualifierOp(ctx: QualifierOpCstChildren) {
      return (ctx.op?.[0]?.image || '') as QualifierOp;
    }
  }

  return new SearchVisitor();
};
