import nearley from 'nearley';

import grammar from './grammar.ts';
import type { LexerQualOps, LexerToken, SimpleLexerToken } from './lexer.ts';
import type { SearchString } from './types.ts';

export type LexerT = 'simple' | 'default';

/**
 * This must match the output of the nearley grammar (grammar.ne). If the grammar structure changes, update this.
 */
export interface ParseResult<T extends LexerT = LexerT> {
  tokens: ParseResultToken<T>[];
}

export interface SimpleParseResult {
  tokens: ParseResultToken<'simple'>[];
}

type ParseResultToken<T extends LexerT = LexerT> = QualifierToken<T> | RawToken<T>;

export type RawToken<T extends LexerT = LexerT> = T extends 'default'
  ? LexerToken<'string'>
  : SimpleLexerToken<'string'>;

export type QualifierToken<T extends LexerT = LexerT> = QualifierSingleToken<T> | QualifierMultiToken<T>;

export type QualifierOp = LexerQualOps | '=';

export interface QualifierSingleToken<T extends LexerT = LexerT> {
  negated: boolean;
  key: T extends 'default' ? LexerToken<'qualKey'> : SimpleLexerToken<'qualKey'>;
  op: QualifierOp;
  val: T extends 'default' ? LexerToken<'qualVal'> : SimpleLexerToken<'qualVal'>;
}

export interface QualifierMultiToken<T extends LexerT = LexerT> {
  negated: boolean;
  key: T extends 'default' ? LexerToken<'qualKey'> : SimpleLexerToken<'qualKey'>;
  op: LexerQualOps | '=';
  val: T extends 'default' ? LexerToken<'qualVal'>[] : SimpleLexerToken<'qualVal'>[];
}

interface ParseSearchQueryOpts {
  parser?: nearley.Parser;
}

/**
 * Some ideas in https://github.com/kach/nearley/issues/316#issuecomment-336718459 if we need to support
 * partial results in the future.
 */
export const parseSearchQuery = (input: SearchString, opts: ParseSearchQueryOpts = {}): ParseResult => {
  const parser = opts.parser || new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(input);

  const output = parser.results[0];

  if (!output) {
    throw new Error('Could not parse search query.');
  }

  return output as ParseResult;
};

export const isQualifier = <T extends LexerT>(token: ParseResultToken<T>): token is QualifierToken<T> =>
  Object.prototype.hasOwnProperty.call(token, 'op');

export const isQualifierMulti = <T extends LexerT>(token: ParseResultToken<T>): token is QualifierMultiToken<T> =>
  isQualifier(token) && Array.isArray(token.val);

export const isRawToken = <T extends LexerT>(token: ParseResultToken<T>): token is RawToken<T> =>
  !token.hasOwnProperty.call(token, 'op');
