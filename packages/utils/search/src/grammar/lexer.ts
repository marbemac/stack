import { type ILexerConfig, type IMultiModeLexerDefinition, Lexer } from 'chevrotain';

import * as t from './tokens.ts';

// note we are placing WhiteSpace first as it is very common thus it will speed up the lexer.
export const lexerTokenDef: IMultiModeLexerDefinition = {
  defaultMode: 'main',
  modes: {
    main: [
      t.WhiteSpace,

      // "keywords" appear before the Identifier
      t.Select,
      t.From,
      t.Where,
      t.LParen,
      t.RParen,
      t.LBracket,
      t.RBracket,
      t.LQuote,
      t.Comma,
      t.Colon,
      t.GreaterEq,
      t.Greater,
      t.LessEq,
      t.Less,
      t.Plus,
      t.Minus,
      t.Equals,
      t.Negate,

      // The Identifier must appear after the keywords because all keywords are valid identifiers.
      t.Identifier,

      t.Integer,
    ],

    quoted_mode: [t.RQuote, t.QuotedIdentifier],
  },
};

interface SearchLexerOpts extends ILexerConfig {}

export const createSearchLexer = (opts?: SearchLexerOpts) => {
  return new Lexer(lexerTokenDef, { positionTracking: 'onlyOffset', ...opts });
};
