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

      // Must appear before minus, plus, and number to avoid ambiguity.
      t.RelativeDate,

      t.QualifierKey,
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
      t.Equals,
      t.Negate,
      t.Iso8601Date,
      t.Boolean,

      // Numbers must appear before minus to avoid ambiguity with negative numbers.
      t.Number,
      t.Minus,

      // The Identifier must appear after the keywords because all keywords are valid identifiers.
      t.Identifier,
    ],

    quoted_mode: [t.RQuote, t.QuotedIdentifier],
  },
};

interface SearchLexerOpts extends ILexerConfig {}

export class SearchLexer extends Lexer {
  constructor(config?: SearchLexerOpts) {
    super(lexerTokenDef, { positionTracking: 'onlyOffset', ...config });
  }
}
