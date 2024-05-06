import {
  type CstNode,
  CstParser,
  type IParserConfig,
  type IRuleConfig,
  type ParserMethod,
  type TokenVocabulary,
} from 'chevrotain';

import { lexerTokenDef } from './lexer.ts';
import type {
  FromClauseCstNode,
  SearchQueryCstNode,
  SelectClauseCstNode,
  WhereClauseCstNode,
  WhereExpressionCstNode,
} from './parser-cst-types.ts';
import * as t from './tokens.ts';

class SearchParserImpl extends CstParser {
  constructor(tokenVocabulary: TokenVocabulary, config?: IParserConfig) {
    super(tokenVocabulary, config);
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
    this.AT_LEAST_ONE_SEP({
      SEP: t.Comma,
      DEF: () => {
        this.CONSUME(t.Identifier);
      },
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
        { ALT: () => this.SUBRULE(this.#filter, { LABEL: 'conditions' }) },
        { ALT: () => this.SUBRULE(this.#atomicFilterVal, { LABEL: 'conditions' }) },
      ]);
    });
  });

  #filter = this.#RULE('filter', () => {
    this.OPTION(() => {
      this.CONSUME(t.Negate);
    });

    this.OR([
      { ALT: () => this.SUBRULE(this.#function, { LABEL: 'lhs' }) },
      { ALT: () => this.SUBRULE(this.#filterKey, { LABEL: 'lhs' }) },
    ]);

    this.SUBRULE(this.#filterOp);

    this.SUBRULE(this.#filterVal, { LABEL: 'rhs' });
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
    this.MANY_SEP2({
      SEP: t.WhiteSpace,
      DEF: () => {
        this.OR([
          { ALT: () => this.SUBRULE(this.#filter, { LABEL: 'args' }) },
          { ALT: () => this.SUBRULE(this.#atomicFilterVal, { LABEL: 'args' }) },
        ]);
      },
    });
  });

  #filterKey = this.#RULE('filterKey', () => {
    this.CONSUME(t.Identifier);
  });

  #filterVal = this.#RULE('filterVal', () => {
    this.OR([{ ALT: () => this.SUBRULE(this.#filterIn) }, { ALT: () => this.SUBRULE(this.#atomicFilterVal) }]);
  });

  #filterIn = this.#RULE('filterIn', () => {
    this.CONSUME(t.LBracket);
    this.AT_LEAST_ONE_SEP({
      SEP: t.Comma,
      DEF: () => {
        this.SUBRULE(this.#atomicFilterVal);
      },
    });
    this.CONSUME2(t.RBracket);
  });

  #atomicFilterVal = this.#RULE('atomicFilterVal', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(t.LQuote);
          this.CONSUME(t.QuotedIdentifier);
          this.CONSUME2(t.RQuote);
        },
      },
      { ALT: () => this.CONSUME(t.Identifier) },
    ]);
  });

  #filterOp = this.#RULE('filterOp', () => {
    this.CONSUME(t.Colon);

    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(t.Minus, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.Plus, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.Equals, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.GreaterEq, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.LessEq, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.Greater, { LABEL: 'op' }) },
        { ALT: () => this.CONSUME(t.Less, { LABEL: 'op' }) },
      ]);
    });
  });
}

interface SearchParserOpts extends IParserConfig {}

export type SearchParser = SearchParserImpl;

export const createSearchParser = (opts?: SearchParserOpts) => {
  return new SearchParserImpl(lexerTokenDef, { recoveryEnabled: true, ...opts });
};
