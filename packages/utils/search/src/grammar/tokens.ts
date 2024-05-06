import { createToken, Lexer } from 'chevrotain';

/**
 * @example
 * plan:
 * foo.bar:
 */
export const QualifierKey = createToken({ name: 'QualifierKey', pattern: /[@_A-Za-z][a-zA-Z0-9@_\-.]+:/ });

// Must not start with a number
export const Identifier = createToken({ name: 'Identifier', pattern: /[@_A-Za-z][a-zA-Z0-9@_\-.]+/ });

// Quoted identifiers support anything except for quotes
export const QuotedIdentifier = createToken({ name: 'QuotedIdentifier', pattern: /[^"]+/ });

// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/chevrotain/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
export const Select = createToken({
  name: 'Select',
  pattern: /SELECT/,
  longer_alt: Identifier,
});

export const From = createToken({
  name: 'From',
  pattern: /FROM/,
  longer_alt: Identifier,
});

export const Where = createToken({
  name: 'Where',
  pattern: /WHERE/,
  longer_alt: Identifier,
});

export const LParen = createToken({ name: 'LParen', pattern: /\(/ });
export const RParen = createToken({ name: 'RParen', pattern: /\)/ });
export const LBracket = createToken({ name: 'LBracket', pattern: /\[/ });
export const RBracket = createToken({ name: 'RBracket', pattern: /]/ });
export const Comma = createToken({ name: 'Comma', pattern: /,\s*/ });
export const Colon = createToken({ name: 'Colon', pattern: /:/ });
export const Greater = createToken({ name: 'Greater', pattern: />/ });
export const Less = createToken({ name: 'Less', pattern: /</ });
export const GreaterEq = createToken({ name: 'GreaterEq', pattern: />=/ });
export const LessEq = createToken({ name: 'LessEq', pattern: /<=/ });
export const Plus = createToken({ name: '+', pattern: /\+/ });
export const Minus = createToken({ name: 'Minus', pattern: /-/ });
export const Equals = createToken({ name: 'Equals', pattern: /=/ });
export const Negate = createToken({ name: 'Negate', pattern: /!/ });
export const Number = createToken({ name: 'Number', pattern: /-?(0|[1-9]\d*)(\.\d+)?/ });
export const DateUnit = createToken({ name: 'DateUnit', pattern: /[s|mi|h|d|w|m|q|y]/ });

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const LQuote = createToken({ name: 'LQuote', pattern: /"/, push_mode: 'quoted_mode' });
export const RQuote = createToken({ name: 'RQuote', pattern: /"/, pop_mode: true });
