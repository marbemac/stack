import { describe, expect, it } from 'vitest';

import type { ParseResult, SimpleParseResult } from '../parse.ts';
import { stringifySearchQuery } from '../stringify.ts';

it('handles empty search', () => {
  const parsed: ParseResult = {
    tokens: [],
  };

  expect(stringifySearchQuery(parsed).query).toEqual('');
});

it('handles a basic string', () => {
  const parsed: SimpleParseResult = {
    tokens: [{ value: 'hello' }],
  };

  expect(stringifySearchQuery(parsed).query).toEqual('hello');
});

describe('qualifiers', () => {
  it('handles a basic qualifier', () => {
    const parsed: SimpleParseResult = {
      tokens: [
        {
          op: '=',
          key: { value: 'user' },
          val: { value: 'john' },
        },
      ],
    };

    expect(stringifySearchQuery(parsed).query).toEqual('user:john');
  });

  it('handles a qualifier with a space', () => {
    const parsed: SimpleParseResult = {
      tokens: [
        {
          op: '=',
          key: { value: 'user' },
          val: { value: 'john doe' },
        },
      ],
    };

    expect(stringifySearchQuery(parsed).query).toEqual('user:"john doe"');
  });

  it('handles operators', () => {
    const parsed: SimpleParseResult = {
      tokens: [
        {
          op: '>',
          key: { value: 'num_members' },
          val: { value: '5' },
        },
      ],
    };

    expect(stringifySearchQuery(parsed).query).toEqual('num_members:>5');
  });
});

describe('multi values', () => {
  it('handles no values', () => {
    const parsed: SimpleParseResult = {
      tokens: [
        {
          op: '=',
          key: { value: 'plan' },
          val: [],
        },
      ],
    };

    expect(stringifySearchQuery(parsed).query).toEqual('plan:');
  });

  it('handles single value', () => {
    const parsed: SimpleParseResult = {
      tokens: [
        {
          op: '=',
          key: { value: 'plan' },
          val: [{ value: 'free' }],
        },
      ],
    };

    expect(stringifySearchQuery(parsed).query).toEqual('plan:free');
  });

  it('handles multiple values', () => {
    const parsed: SimpleParseResult = {
      tokens: [
        {
          op: '=',
          key: { value: 'plan' },
          val: [{ value: 'free' }, { value: 'starter' }],
        },
      ],
    };

    expect(stringifySearchQuery(parsed).query).toEqual('plan:[free, starter]');
  });
});
