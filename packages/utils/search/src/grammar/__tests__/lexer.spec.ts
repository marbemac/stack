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

describe('Dot accessor', () => {
  it('tokenizes a leading dot (after a function call) as the Dot token', () => {
    const l = new SearchLexer();

    const lexResult = l.tokenize('first(observations, -created_at).kind');

    expect(lexResult.errors.length).toBe(0);
    const names = lexResult.tokens.map(tok => tok.tokenType.name);
    expect(names).toContain('Dot');
    // the trait after the dot is a normal Identifier
    expect(names[names.length - 1]).toBe(Identifier.name);
  });

  it('keeps a dotted identifier as a single Identifier (has-one traversal, e.g. person.name)', () => {
    const l = new SearchLexer();

    const lexResult = l.tokenize('person.name');

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
