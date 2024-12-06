import { createToken, Lexer } from 'chevrotain';

/**
 * @example
 * plan:
 * foo.bar:
 * $last_seen:
 * company.$id:
 */
export const QualifierKey = createToken({ name: 'QualifierKey', pattern: /[@_A-Za-z$][a-zA-Z0-9@_$\-.]*:/ });

export const Identifier = createToken({ name: 'Identifier', pattern: /[@_A-Za-z0-9$][a-zA-Z0-9@_$\-.]*/ });

// Quoted identifiers support anything except for quotes
export const QuotedIdentifier = createToken({ name: 'QuotedIdentifier', pattern: /[^"]+/ });

/**
 * The longer_alt here allows us to handle strings that start with a number, e.g. "3industries"
 */
export const Number = createToken({ name: 'Number', pattern: /-?(0|[1-9]\d*)(\.\d+)?/, longer_alt: Identifier });

export const Iso8601Date = createToken({
  name: 'Iso8601Date',
  pattern: /\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?/i,
  // The longer alts here are in case of large numbers that might trigger the Iso check, and fallback to plain text if nothing matches
  longer_alt: [Number, Identifier],
});

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
export const Boolean = createToken({ name: 'Boolean', pattern: /true|false/ });
export const Plus = createToken({ name: '+', pattern: /\+/ });
export const Minus = createToken({ name: 'Minus', pattern: /-/ });
export const Equals = createToken({ name: 'Equals', pattern: /=/ });
export const Negate = createToken({ name: 'Negate', pattern: /!/ });

// https://chevrotain.io/docs/guide/custom_token_patterns.html#custom-payloads
// We're using this to get access to the regex capture groups in payload later (in the visitor)
export interface RelativeDateTokenPayload {
  sign: '+' | '-';
  value: string;
  unit: 's' | 'mi' | 'h' | 'd' | 'w' | 'm' | 'y';
}
const relativeDatePattern = /(?<sign>-|\+)(?<value>\d+)(?<unit>[s|mi|h|d|w|m|q|y])/y;
export const RelativeDate = createToken({
  name: 'RelativeDate',
  pattern: (text, startOffset) => {
    relativeDatePattern.lastIndex = startOffset;

    const result = relativeDatePattern.exec(text);
    if (result) {
      // @ts-expect-error ignore - this is the official way to add custom payload to tokens w chevrotain
      result.payload = result.groups;
    }

    return result;
  },
});

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const LQuote = createToken({ name: 'LQuote', pattern: /"/, push_mode: 'quoted_mode' });
export const RQuote = createToken({ name: 'RQuote', pattern: /"/, pop_mode: true });
