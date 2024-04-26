import { describe, expect, it } from 'vitest';

import type { SimpleParseResult } from '../parse.ts';
import { addQualifier } from '../transform.ts';

describe('addQualifier()', () => {
  it('adds a new qualifier', () => {
    const parsed: SimpleParseResult = {
      tokens: [],
    };

    addQualifier(parsed.tokens, {
      key: 'user',
      op: '=',
      val: 'joe',
    });

    expect(parsed.tokens).toEqual([
      {
        key: { value: 'user' },
        op: '=',
        val: { value: 'joe' },
      },
    ]);
  });
});
