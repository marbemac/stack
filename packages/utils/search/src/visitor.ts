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
  RelativeDateValCstChildren,
  RelativeDateValCstNode,
  SearchQueryCstChildren,
  SearchQueryCstNode,
  SelectClauseCstChildren,
  SelectClauseCstNode,
  SelectExprCstChildren,
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
  | RelativeDateValAstNode
  | TextValAstNode
  | NumberValAstNode
  | BooleanValAstNode;

export type SearchNodeType = SearchNode['type'];

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

export interface QualifierAstNode extends SearchNodeBase {
  type: 'qualifier';
  negated: boolean;
  lhs: QualifierKeyAstNode;
  op?: QualifierOp | '';
  rhs?: QualifierVal;
}

export interface FunctionAstNode extends SearchNodeBase {
  type: 'function';
  name: string;
  negated: boolean;
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

export type QualifierVal = BracketListAstNode | AtomicQualifierVal | RelativeDateValAstNode;

export interface BracketListAstNode extends SearchNodeBase {
  type: 'bracket_list';
  values: AtomicQualifierVal[];
}

export interface RelativeDateValAstNode extends SearchNodeBase {
  type: 'relative_date';
  value: string;
  parsed: number;
  sign: RelativeDateTokenPayload['sign'];
  unit: RelativeDateTokenPayload['unit'];
}

export interface TextValAstNode extends SearchNodeBase {
  type: 'text';
  quoted?: boolean;
  value: string;
}

export interface NumberValAstNode extends SearchNodeBase {
  type: 'number';
  value: string;
  parsed: number;
}

export interface BooleanValAstNode extends SearchNodeBase {
  type: 'boolean';
  value: string;
  parsed: boolean;
}

export type AtomicQualifierVal = TextValAstNode | NumberValAstNode | BooleanValAstNode;

export type QualifierOp = '=' | '>' | '<' | '>=' | '<=';

export type SearchVisitor = ReturnType<typeof createSearchVisitor>;

let parserSingleton: SearchParser;

/**
 * For some nodes, it is useful to expose some of the (shallow) data associated with the node to the
 * enter/exit hooks. This is a mapping of the token type to the data that is available.
 */
export interface OnEnterExitDataMap {
  search_query: {};
  select_clause: {};
  select_expr: {};
  from_clause: Pick<FromClauseAstNode, 'table'>;
  where_clause: {};
  where_expr: {};
  qualifier: {};
  function: Pick<FunctionAstNode, 'name'>;
  function_arg: Pick<FunctionArgAstNode, 'position'>;
  qualifier_key: {};
  bracket_list: {};
  relative_date: {};
  text: {};
  number: {};
  boolean: {};
}

interface CreateSearchVisitorOpts {
  onEnter?: <T extends SearchNodeType>(type: T, data: OnEnterExitDataMap[T]) => void;
  onExit?: <T extends SearchNodeType>(type: T, data: OnEnterExitDataMap[T]) => void;
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
      onEnter?.('search_query', {});

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

      onExit?.('search_query', {});

      return t;
    }

    fromClause(ctx: FromClauseCstChildren) {
      const table = ctx.Identifier[0]?.image || '';

      onEnter?.('from_clause', { table });

      const t = maybeTransform({
        type: 'from_clause',
        table,
        get isBranchInvalid() {
          const $ = this as FromClauseAstNode;
          return !!$.invalid;
        },
      }) satisfies FromClauseAstNode;

      onExit?.('from_clause', { table });

      return t;
    }

    selectClause(ctx: SelectClauseCstChildren) {
      onEnter?.('select_clause', {});

      const t = maybeTransform({
        type: 'select_clause',
        expr: this.#visit(ctx.selectExpr),
        get isBranchInvalid() {
          const $ = this as SelectClauseAstNode;
          return !!$.invalid || $.expr.isBranchInvalid;
        },
      }) satisfies SelectClauseAstNode;

      onExit?.('select_clause', {});

      return t;
    }

    selectExpr(ctx: SelectExprCstChildren) {
      onEnter?.('select_expr', {});

      const t = maybeTransform({
        type: 'select_expr',
        columns: (ctx.columns || []).map(f => this.#visit(f)),
        get isBranchInvalid() {
          const $ = this as SelectExprAstNode;
          return !!$.invalid || $.columns.some(c => c.isBranchInvalid);
        },
      }) satisfies SelectExprAstNode;

      onExit?.('select_expr', {});

      return t;
    }

    whereClause(ctx: WhereClauseCstChildren) {
      onEnter?.('where_clause', {});

      const t = maybeTransform({
        type: 'where_clause',
        expr: this.#visit(ctx.whereExpr),
        get isBranchInvalid() {
          const $ = this as WhereClauseAstNode;
          return !!$.invalid || $.expr.isBranchInvalid;
        },
      }) satisfies WhereClauseAstNode;

      onExit?.('where_clause', {});

      return t;
    }

    whereExpr(ctx: WhereExprCstChildren) {
      onEnter?.('where_expr', {});

      const t = maybeTransform({
        type: 'where_expr',
        conditions: (ctx.conditions || []).map(f => this.#visit(f)),
        get isBranchInvalid() {
          const $ = this as WhereExprAstNode;
          return !!$.invalid || $.conditions.some(c => c.isBranchInvalid);
        },
      }) satisfies WhereExprAstNode;

      onExit?.('where_expr', {});

      return t;
    }

    qualifier(ctx: QualifierCstChildren) {
      onEnter?.('qualifier', {});

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

      onExit?.('qualifier', {});

      return t;
    }

    function(ctx: FunctionCstChildren) {
      const name = ctx.Identifier[0]!.image;

      onEnter?.('function', { name });

      const t = maybeTransform({
        type: 'function',
        name,
        negated: !!ctx.Negate,
        args: (ctx.functionArg || []).map((arg, i) => this.#visit(arg, { position: i })).filter(a => !!a.vals.length),
        op: ctx.qualifierOp ? this.#visit(ctx.qualifierOp) : undefined,
        rhs: ctx.rhs ? this.#visit(ctx.rhs) : undefined,
        get isBranchInvalid() {
          const $ = this as FunctionAstNode;
          return !!$.invalid || !!$.rhs?.isBranchInvalid || $.args.some(a => a.isBranchInvalid);
        },
      }) satisfies FunctionAstNode;

      onExit?.('function', { name });

      return t;
    }

    functionArg(ctx: FunctionArgCstChildren, { position }: { position: number }) {
      onEnter?.('function_arg', { position });

      const t = maybeTransform({
        type: 'function_arg',
        position,
        vals: (ctx.args || []).map(arg => this.#visit(arg)),
        get isBranchInvalid() {
          const $ = this as FunctionArgAstNode;
          return !!$.invalid || $.vals.some(a => a.isBranchInvalid);
        },
      }) satisfies FunctionArgAstNode;

      onExit?.('function_arg', { position });

      return t;
    }

    qualifierKey(ctx: QualifierKeyCstChildren) {
      onEnter?.('qualifier_key', {});

      const t = maybeTransform({
        type: 'qualifier_key',
        value: (ctx.QualifierKey?.[0]?.image || '').slice(0, -1), // slice the ":" off
        get isBranchInvalid() {
          const $ = this as QualifierKeyAstNode;
          return !!$.invalid;
        },
      }) satisfies QualifierKeyAstNode;

      onExit?.('qualifier_key', {});

      return t;
    }

    qualifierVal(ctx: QualifierValCstChildren) {
      const val = ctx.val?.[0];
      if (!val) return undefined;

      return this.#visit(val) satisfies QualifierVal;
    }

    bracketList(ctx: BracketListCstChildren) {
      onEnter?.('bracket_list', {});

      const t = maybeTransform({
        type: 'bracket_list',
        values: ctx.atomicQualifierVal.map(val => this.#visit(val)),
        get isBranchInvalid() {
          const $ = this as BracketListAstNode;
          return !!$.invalid || $.values.some(v => v.isBranchInvalid);
        },
      }) satisfies BracketListAstNode;

      onExit?.('bracket_list', {});

      return t;
    }

    relativeDateVal(ctx: RelativeDateValCstChildren) {
      onEnter?.('relative_date', {});

      const { sign, unit, value } = ctx.RelativeDate[0]?.payload as RelativeDateTokenPayload;

      const parsed = parseFloat(value);

      const t = maybeTransform({
        type: 'relative_date',
        sign,
        unit,
        value,
        parsed,
        get isBranchInvalid() {
          const $ = this as RelativeDateValAstNode;
          return !!$.invalid;
        },
      }) satisfies RelativeDateValAstNode;

      onExit?.('relative_date', {});

      return t;
    }

    atomicQualifierVal(ctx: AtomicQualifierValCstChildren) {
      if (ctx.Number) {
        onEnter?.('number', {});

        const value = ctx.Number?.[0]?.image || '';
        const parsed = parseFloat(value);

        const t = maybeTransform({
          type: 'number',
          value,
          parsed,
          get isBranchInvalid() {
            const $ = this as NumberValAstNode;
            return !!$.invalid;
          },
        }) satisfies NumberValAstNode;

        onExit?.('number', {});

        return t;
      }

      if (ctx.Boolean) {
        onEnter?.('boolean', {});

        const value = ctx.Boolean?.[0]?.image || '';
        const parsed = JSON.parse(value) as boolean;

        const t = maybeTransform({
          type: 'boolean',
          value,
          parsed,
          get isBranchInvalid() {
            const $ = this as BooleanValAstNode;
            return !!$.invalid;
          },
        }) satisfies BooleanValAstNode;

        onExit?.('boolean', {});

        return t;
      }

      onEnter?.('text', {});

      const t = maybeTransform({
        type: 'text',
        quoted: ctx.QuotedIdentifier?.[0] ? true : false,
        value: (ctx.QuotedIdentifier?.[0] || ctx.Identifier?.[0])?.image || '',
        get isBranchInvalid() {
          const $ = this as TextValAstNode;
          return !!$.invalid;
        },
      }) satisfies TextValAstNode;

      onExit?.('text', {});

      return t;
    }

    qualifierOp(ctx: QualifierOpCstChildren) {
      return (ctx.op?.[0]?.image || '') as QualifierOp;
    }
  }

  return new SearchVisitor();
};
