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
  selectExpression: SelectExpressionCstNode[];
};

export interface SelectExpressionCstNode extends CstNode {
  name: "selectExpression";
  children: SelectExpressionCstChildren;
}

export type SelectExpressionCstChildren = {
  columns?: (QualifierCstNode | FunctionCstNode | AtomicQualifierValCstNode)[];
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
  conditions?: (QualifierCstNode | FunctionCstNode | AtomicQualifierValCstNode)[];
};

export interface QualifierCstNode extends CstNode {
  name: "qualifier";
  children: QualifierCstChildren;
}

export type QualifierCstChildren = {
  Negate?: IToken[];
  lhs: QualifierKeyCstNode[];
  qualifierOp?: QualifierOpCstNode[];
  rhs?: QualifierValCstNode[];
};

export interface FunctionCstNode extends CstNode {
  name: "function";
  children: FunctionCstChildren;
}

export type FunctionCstChildren = {
  Negate?: IToken[];
  Identifier: IToken[];
  LParen: IToken[];
  functionArg?: FunctionArgCstNode[];
  Comma?: IToken[];
  RParen: IToken[];
  qualifierOp: QualifierOpCstNode[];
  rhs?: QualifierValCstNode[];
};

export interface FunctionArgCstNode extends CstNode {
  name: "functionArg";
  children: FunctionArgCstChildren;
}

export type FunctionArgCstChildren = {
  args?: (QualifierCstNode | AtomicQualifierValCstNode)[];
};

export interface QualifierKeyCstNode extends CstNode {
  name: "qualifierKey";
  children: QualifierKeyCstChildren;
}

export type QualifierKeyCstChildren = {
  QualifierKey: IToken[];
};

export interface QualifierValCstNode extends CstNode {
  name: "qualifierVal";
  children: QualifierValCstChildren;
}

export type QualifierValCstChildren = {
  val?: (QualifierInCstNode | RelativeDateValCstNode | AtomicQualifierValCstNode)[];
};

export interface QualifierInCstNode extends CstNode {
  name: "qualifierIn";
  children: QualifierInCstChildren;
}

export type QualifierInCstChildren = {
  LBracket: IToken[];
  atomicQualifierVal: AtomicQualifierValCstNode[];
  Comma?: IToken[];
  RBracket: IToken[];
};

export interface RelativeDateValCstNode extends CstNode {
  name: "relativeDateVal";
  children: RelativeDateValCstChildren;
}

export type RelativeDateValCstChildren = {
  op?: (IToken)[];
  Number: IToken[];
  DateUnit: IToken[];
};

export interface AtomicQualifierValCstNode extends CstNode {
  name: "atomicQualifierVal";
  children: AtomicQualifierValCstChildren;
}

export type AtomicQualifierValCstChildren = {
  LQuote?: IToken[];
  QuotedIdentifier?: IToken[];
  RQuote?: IToken[];
  Identifier?: IToken[];
  Number?: IToken[];
};

export interface QualifierOpCstNode extends CstNode {
  name: "qualifierOp";
  children: QualifierOpCstChildren;
}

export type QualifierOpCstChildren = {
  op?: (IToken)[];
};

export interface TSearchCstVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  searchQuery(children: SearchQueryCstChildren, param?: IN): OUT;
  selectClause(children: SelectClauseCstChildren, param?: IN): OUT;
  selectExpression(children: SelectExpressionCstChildren, param?: IN): OUT;
  fromClause(children: FromClauseCstChildren, param?: IN): OUT;
  whereClause(children: WhereClauseCstChildren, param?: IN): OUT;
  whereExpression(children: WhereExpressionCstChildren, param?: IN): OUT;
  qualifier(children: QualifierCstChildren, param?: IN): OUT;
  function(children: FunctionCstChildren, param?: IN): OUT;
  functionArg(children: FunctionArgCstChildren, param?: IN): OUT;
  qualifierKey(children: QualifierKeyCstChildren, param?: IN): OUT;
  qualifierVal(children: QualifierValCstChildren, param?: IN): OUT;
  qualifierIn(children: QualifierInCstChildren, param?: IN): OUT;
  relativeDateVal(children: RelativeDateValCstChildren, param?: IN): OUT;
  atomicQualifierVal(children: AtomicQualifierValCstChildren, param?: IN): OUT;
  qualifierOp(children: QualifierOpCstChildren, param?: IN): OUT;
}
