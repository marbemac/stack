import { describe, expect, it } from 'vitest';

import { SearchLexer } from '../lexer.ts';
import { Identifier } from '../tokens.ts';

describe('ambiguous identifiers', () => {
  it('show support starting and ending with a number', () => {
    const l = new SearchLexer();

    const lexResult = l.tokenize('1abc2');

    expect(lexResult.errors.length).toBe(0);
    expect(lexResult.tokens.length).toBe(1);
    expect(lexResult.tokens[0]!.tokenType.name).toBe(Identifier.name);
  });

  it('should support starting with a Iso8601Date like pattern', () => {
    const l = new SearchLexer();

    const lexResult = l.tokenize('20251abc');

    expect(lexResult.errors.length).toBe(0);
    expect(lexResult.tokens.length).toBe(1);
    expect(lexResult.tokens[0]!.tokenType.name).toBe(Identifier.name);
  });
});
