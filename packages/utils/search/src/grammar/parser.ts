import { type CstNode, CstParser, type IParserConfig, type IRuleConfig, type ParserMethod } from 'chevrotain';

import { lexerTokenDef } from './lexer.ts';
import type {
  FromClauseCstNode,
  SearchQueryCstNode,
  SelectClauseCstNode,
  SelectExpressionCstNode,
  WhereClauseCstNode,
  WhereExpressionCstNode,
} from './parser-cst-types.ts';
import * as t from './tokens.ts';

export interface SearchParserOpts extends IParserConfig {}

export class SearchParser extends CstParser {
  constructor(config?: SearchParserOpts) {
    super(lexerTokenDef, { recoveryEnabled: true, ...config });
    this.performSelfAnalysis();
  }

  /** Pass through that just adjusts the typings to allow us to type the rule responses for the public api */
  #RULE<N extends CstNode, F extends () => void = () => void>(
    name: string,
    implementation: F,
    config?: IRuleConfig<N>,
  ): ParserMethod<Parameters<F>, N> {
    return this.RULE(name, implementation, config) as ParserMethod<Parameters<F>, N>;
  }

  public searchQuery = this.#RULE<SearchQueryCstNode>('searchQuery', () => {
    this.SUBRULE(this.selectClause);
    this.SUBRULE(this.fromClause);
    this.OPTION(() => {
      this.SUBRULE(this.whereClause);
    });
  });

  public selectClause = this.#RULE<SelectClauseCstNode>('selectClause', () => {
    this.CONSUME(t.Select);
    this.SUBRULE(this.selectExpression);
  });

  public selectExpression = this.#RULE<SelectExpressionCstNode>('selectExpression', () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.#qualifier, { LABEL: 'columns' }) },
        { ALT: () => this.SUBRULE(this.#atomicQualifierVal, { LABEL: 'columns' }) },
      ]);
    });
  });

  public fromClause = this.#RULE<FromClauseCstNode>('fromClause', () => {
    this.CONSUME(t.From);
    this.CONSUME(t.Identifier);
  });

  public whereClause = this.#RULE<WhereClauseCstNode>('whereClause', () => {
    this.CONSUME(t.Where);
    this.SUBRULE(this.whereExpression);
  });

  public whereExpression = this.#RULE<WhereExpressionCstNode>('whereExpression', () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.#qualifier, { LABEL: 'conditions' }) },
        { ALT: () => this.SUBRULE(this.#atomicQualifierVal, { LABEL: 'conditions' }) },
      ]);
    });
  });

  #qualifier = this.#RULE('qualifier', () => {
    this.OPTION(() => {
      this.CONSUME(t.Negate);
    });

    this.OR([
      { ALT: () => this.SUBRULE(this.#function, { LABEL: 'lhs' }) },
      { ALT: () => this.SUBRULE(this.#qualifierKey, { LABEL: 'lhs' }) },
    ]);

    this.SUBRULE(this.#qualifierOp);

    this.SUBRULE(this.#qualifierVal, { LABEL: 'rhs' });
  });

  #function = this.#RULE('function', () => {
    this.CONSUME(t.Identifier);
    this.CONSUME(t.LParen);

    this.MANY_SEP({
      SEP: t.Comma,
      DEF: () => {
        this.SUBRULE(this.#functionArg);
      },
    });

    this.CONSUME(t.RParen);
  });

  #functionArg = this.#RULE('functionArg', () => {
    this.MANY_SEP({
      SEP: t.WhiteSpace,
      DEF: () => {
        this.OR([
          { ALT: () => this.SUBRULE(this.#qualifier, { LABEL: 'args' }) },
          { ALT: () => this.SUBRULE(this.#atomicQualifierVal, { LABEL: 'args' }) },
        ]);
      },
    });
  });

  #qualifierKey = this.#RULE('qualifierKey', () => {
    this.CONSUME(t.Identifier);
  });

  #qualifierVal = this.#RULE('qualifierVal', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.#qualifierIn, { LABEL: 'val' }) },
      { ALT: () => this.SUBRULE(this.#relativeDateVal, { LABEL: 'val' }) },
      { ALT: () => this.SUBRULE(this.#atomicQualifierVal, { LABEL: 'val' }) },
    ]);
  });

  #qualifierIn = this.#RULE('qualifierIn', () => {
    this.CONSUME(t.LBracket);
    this.AT_LEAST_ONE_SEP({
      SEP: t.Comma,
      DEF: () => {
        this.SUBRULE(this.#atomicQualifierVal);
      },
    });
    this.CONSUME2(t.RBracket);
  });

  #relativeDateVal = this.#RULE('relativeDateVal', () => {
    this.OR([
      { ALT: () => this.CONSUME(t.Plus, { LABEL: 'op' }) },
      { ALT: () => this.CONSUME(t.Minus, { LABEL: 'op' }) },
    ]);

    this.CONSUME(t.Number);
    this.CONSUME(t.DateUnit);
  });

  #atomicQualifierVal = this.#RULE('atomicQualifierVal', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(t.LQuote);
          this.CONSUME(t.QuotedIdentifier);
          this.CONSUME2(t.RQuote);
        },
      },
      { ALT: () => this.CONSUME(t.Identifier) },
      { ALT: () => this.CONSUME(t.Number) },
    ]);
  });

  #qualifierOp = this.#RULE('qualifierOp', () => {
    this.CONSUME(t.Colon);

    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(t.Equals, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.GreaterEq, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.LessEq, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.Greater, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.Less, { LABEL: 'op' }) },
      ]);
    });
  });
}
