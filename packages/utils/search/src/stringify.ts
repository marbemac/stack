import type { SimpleLexerToken } from './lexer.ts';
import type {
  LexerT,
  ParseResult,
  QualifierOp,
  QualifierSingleToken,
  QualifierToken,
  SimpleParseResult,
} from './parse.ts';
import { isQualifier, isQualifierMulti, isRawToken } from './parse.ts';
import type { SearchString } from './types.ts';

export const stringifySearchQuery = (input: ParseResult | SimpleParseResult): { query: SearchString } => {
  const queryParts: string[] = [];

  for (const token of input.tokens) {
    if (isRawToken(token)) {
      queryParts.push(handleRawToken(token));
    } else if (isQualifier(token)) {
      queryParts.push(handleQualifierToken(token));
    } else {
      console.warn('Unknown token type!', token);
    }
  }

  return {
    query: queryParts.join(' ') as SearchString,
  };
};

const handleRawToken = (token: SimpleLexerToken<'string'>) => {
  return token.value;
};

const handleQualifierToken = (token: QualifierToken<LexerT>) => {
  if (isQualifierMulti(token)) {
    if (token.val.length <= 1) {
      return handleQualifierSingle({
        ...token,
        val: token.val[0] || { value: '' },
      });
    }

    const valsString = token.val.map(v => handleQualifierVal(v, { skipQuotes: true }));

    return `${handleQualifierKey(token.key)}:[${valsString.join(', ')}]`;
  }

  return handleQualifierSingle(token);
};

const handleQualifierSingle = (token: QualifierSingleToken<'simple'>) => {
  return `${handleQualifierKey(token.key)}${handleQualifierOp(token.op)}${handleQualifierVal(token.val)}`;
};

const handleQualifierKey = (token: SimpleLexerToken<'qualKey'>) => {
  return token.value;
};

const handleQualifierOp = (op: QualifierOp) => {
  return op === '=' ? ':' : `:${op}`;
};

const handleQualifierVal = (token: SimpleLexerToken<'qualVal'>, { skipQuotes }: { skipQuotes?: boolean } = {}) => {
  if (!skipQuotes && token.value.match(/\s/)) {
    return `"${token.value}"`;
  }

  return token.value;
};
