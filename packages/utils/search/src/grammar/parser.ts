import { type CstNode, CstParser, type IParserConfig, type IRuleConfig, type ParserMethod } from 'chevrotain';

import { lexerTokenDef } from './lexer.ts';
import type {
  FromClauseCstNode,
  SearchQueryCstNode,
  SelectClauseCstNode,
  SelectExprCstNode,
  WhereClauseCstNode,
  WhereExprCstNode,
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
    this.SUBRULE(this.fromClause);

    this.OPTION(() => {
      this.SUBRULE(this.selectClause);
    });

    this.OPTION2(() => {
      this.SUBRULE(this.whereClause);
    });
  });

  public selectClause = this.#RULE<SelectClauseCstNode>('selectClause', () => {
    this.CONSUME(t.Select);
    this.SUBRULE(this.selectExpr);
  });

  public selectExpr = this.#RULE<SelectExprCstNode>('selectExpr', () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.#qualifier, { LABEL: 'columns' }) },
        { ALT: () => this.SUBRULE(this.#function, { LABEL: 'columns' }) },
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
    this.SUBRULE(this.whereExpr);
  });

  public whereExpr = this.#RULE<WhereExprCstNode>('whereExpr', () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.#qualifier, { LABEL: 'conditions' }) },
        { ALT: () => this.SUBRULE(this.#function, { LABEL: 'conditions' }) },
      ]);
    });
  });

  #qualifier = this.#RULE('qualifier', () => {
    this.OPTION2(() => {
      this.CONSUME(t.Negate);
    });

    this.SUBRULE(this.#qualifierKey, { LABEL: 'lhs' });

    this.OPTION3(() => {
      this.SUBRULE(this.#qualifierOp);
      this.SUBRULE(this.#qualifierVal, { LABEL: 'rhs' });
    });
  });

  #function = this.#RULE('function', () => {
    this.OPTION(() => {
      this.SUBRULE(this.#sortDir);
    });

    this.OPTION2(() => {
      this.CONSUME(t.Negate);
    });

    this.CONSUME(t.Identifier);
    this.CONSUME(t.LParen);

    this.MANY_SEP({
      SEP: t.Comma,
      DEF: () => {
        this.SUBRULE(this.#functionArg);
      },
    });

    this.CONSUME(t.RParen);

    this.OPTION3(() => {
      this.CONSUME(t.Colon);
      this.SUBRULE(this.#qualifierOp);
      this.SUBRULE(this.#qualifierVal, { LABEL: 'rhs' });
    });
  });

  #functionArg = this.#RULE('functionArg', () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.#qualifier, { LABEL: 'args' }) },
        { ALT: () => this.SUBRULE(this.#atomicQualifierVal, { LABEL: 'args' }) },
      ]);
    });
  });

  #qualifierKey = this.#RULE('qualifierKey', () => {
    this.CONSUME(t.QualifierKey);
  });

  #qualifierVal = this.#RULE('qualifierVal', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.#bracketList, { LABEL: 'val' }) },
      { ALT: () => this.SUBRULE(this.#atomicQualifierVal, { LABEL: 'val', ARGS: [true] }) },
    ]);
  });

  #bracketList = this.#RULE('bracketList', () => {
    this.CONSUME(t.LBracket);
    this.AT_LEAST_ONE_SEP({
      SEP: t.Comma,
      DEF: () => {
        this.SUBRULE(this.#atomicQualifierVal, { ARGS: [true] });
      },
    });
    this.CONSUME2(t.RBracket);
  });

  #atomicQualifierVal = this.#RULE('atomicQualifierVal', (skipSortDir?: boolean) => {
    this.OPTION({
      GATE: () => !skipSortDir,
      DEF: () => {
        this.SUBRULE(this.#sortDir);
      },
    });

    this.OR([
      {
        ALT: () => {
          this.CONSUME(t.LQuote);
          this.CONSUME(t.QuotedIdentifier);
          this.CONSUME2(t.RQuote);
        },
      },
      { ALT: () => this.CONSUME(t.Number) },
      { ALT: () => this.CONSUME(t.Boolean) },
      { ALT: () => this.CONSUME(t.RelativeDate) },
      { ALT: () => this.CONSUME(t.Iso8601Date) },
      { ALT: () => this.CONSUME(t.Identifier) },
    ]);
  });

  #sortDir = this.#RULE('sortDir', () => {
    this.OR([
      { ALT: () => this.CONSUME(t.Plus, { LABEL: 'dir' }) },
      { ALT: () => this.CONSUME(t.Minus, { LABEL: 'dir' }) },
    ]);
  });

  #qualifierOp = this.#RULE('qualifierOp', () => {
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
