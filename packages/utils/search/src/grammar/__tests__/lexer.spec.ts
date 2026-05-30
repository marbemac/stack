import { describe, expect, it } from 'vitest';

import { SearchLexer } from '../lexer.ts';
import { Identifier } from '../tokens.ts';

describe('GROUP keyword', () => {
  it('tokenizes GROUP as the Group keyword', () => {
    const l = new SearchLexer();

    const lexResult = l.tokenize('GROUP industry');

    expect(lexResult.errors.length).toBe(0);
    expect(lexResult.tokens[0]!.tokenType.name).toBe('Group');
  });

  it('treats GROUP-prefixed identifiers as identifiers (longer_alt)', () => {
    const l = new SearchLexer();

    const lexResult = l.tokenize('GROUPING');

    expect(lexResult.errors.length).toBe(0);
    expect(lexResult.tokens.length).toBe(1);
    expect(lexResult.tokens[0]!.tokenType.name).toBe(Identifier.name);
  });
});

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
