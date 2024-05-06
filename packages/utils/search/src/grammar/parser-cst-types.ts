/* eslint-disable @typescript-eslint/consistent-type-definitions */

// generated via yarn build.grammar-types

import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface SearchQueryCstNode extends CstNode {
  name: "searchQuery";
  children: SearchQueryCstChildren;
}

export type SearchQueryCstChildren = {
  selectClause: SelectClauseCstNode[];
  fromClause: FromClauseCstNode[];
  whereClause?: WhereClauseCstNode[];
};

export interface SelectClauseCstNode extends CstNode {
  name: "selectClause";
  children: SelectClauseCstChildren;
}

export type SelectClauseCstChildren = {
  Select: IToken[];
  Identifier: IToken[];
  Comma?: IToken[];
};

export interface FromClauseCstNode extends CstNode {
  name: "fromClause";
  children: FromClauseCstChildren;
}

export type FromClauseCstChildren = {
  From: IToken[];
  Identifier: IToken[];
};

export interface WhereClauseCstNode extends CstNode {
  name: "whereClause";
  children: WhereClauseCstChildren;
}

export type WhereClauseCstChildren = {
  Where: IToken[];
  whereExpression: WhereExpressionCstNode[];
};

export interface WhereExpressionCstNode extends CstNode {
  name: "whereExpression";
  children: WhereExpressionCstChildren;
}

export type WhereExpressionCstChildren = {
  conditions?: (FilterCstNode | AtomicFilterValCstNode)[];
};

export interface FilterCstNode extends CstNode {
  name: "filter";
  children: FilterCstChildren;
}

export type FilterCstChildren = {
  Negate?: IToken[];
  lhs?: (FunctionCstNode | FilterKeyCstNode)[];
  filterOp: FilterOpCstNode[];
  rhs: FilterValCstNode[];
};

export interface FunctionCstNode extends CstNode {
  name: "function";
  children: FunctionCstChildren;
}

export type FunctionCstChildren = {
  Identifier: IToken[];
  LParen: IToken[];
  functionArg?: FunctionArgCstNode[];
  Comma?: IToken[];
  RParen: IToken[];
};

export interface FunctionArgCstNode extends CstNode {
  name: "functionArg";
  children: FunctionArgCstChildren;
}

export type FunctionArgCstChildren = {
  args?: (FilterCstNode | AtomicFilterValCstNode)[];
  WhiteSpace?: IToken[];
};

export interface FilterKeyCstNode extends CstNode {
  name: "filterKey";
  children: FilterKeyCstChildren;
}

export type FilterKeyCstChildren = {
  Identifier: IToken[];
};

export interface FilterValCstNode extends CstNode {
  name: "filterVal";
  children: FilterValCstChildren;
}

export type FilterValCstChildren = {
  val?: (FilterInCstNode | RelativeDateFilterValCstNode | AtomicFilterValCstNode)[];
};

export interface FilterInCstNode extends CstNode {
  name: "filterIn";
  children: FilterInCstChildren;
}

export type FilterInCstChildren = {
  LBracket: IToken[];
  atomicFilterVal: AtomicFilterValCstNode[];
  Comma?: IToken[];
  RBracket: IToken[];
};

export interface RelativeDateFilterValCstNode extends CstNode {
  name: "relativeDateFilterVal";
  children: RelativeDateFilterValCstChildren;
}

export type RelativeDateFilterValCstChildren = {
  op?: (IToken)[];
  Number: IToken[];
  DateUnit: IToken[];
};

export interface AtomicFilterValCstNode extends CstNode {
  name: "atomicFilterVal";
  children: AtomicFilterValCstChildren;
}

export type AtomicFilterValCstChildren = {
  LQuote?: IToken[];
  QuotedIdentifier?: IToken[];
  RQuote?: IToken[];
  Identifier?: IToken[];
  Number?: IToken[];
};

export interface FilterOpCstNode extends CstNode {
  name: "filterOp";
  children: FilterOpCstChildren;
}

export type FilterOpCstChildren = {
  Colon: IToken[];
  op?: (IToken)[];
};

export interface TSearchCstVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  searchQuery(children: SearchQueryCstChildren, param?: IN): OUT;
  selectClause(children: SelectClauseCstChildren, param?: IN): OUT;
  fromClause(children: FromClauseCstChildren, param?: IN): OUT;
  whereClause(children: WhereClauseCstChildren, param?: IN): OUT;
  whereExpression(children: WhereExpressionCstChildren, param?: IN): OUT;
  filter(children: FilterCstChildren, param?: IN): OUT;
  function(children: FunctionCstChildren, param?: IN): OUT;
  functionArg(children: FunctionArgCstChildren, param?: IN): OUT;
  filterKey(children: FilterKeyCstChildren, param?: IN): OUT;
  filterVal(children: FilterValCstChildren, param?: IN): OUT;
  filterIn(children: FilterInCstChildren, param?: IN): OUT;
  relativeDateFilterVal(children: RelativeDateFilterValCstChildren, param?: IN): OUT;
  atomicFilterVal(children: AtomicFilterValCstChildren, param?: IN): OUT;
  filterOp(children: FilterOpCstChildren, param?: IN): OUT;
}
