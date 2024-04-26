import { loadFixtures } from '@marbemac/utils-testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BooleanOperator,
  InvalidReason,
  type ParseResult,
  parseSearch,
  type SearchConfig,
  Token,
  type TokenResult,
} from '../parser.ts';
import { treeTransformer } from '../utils.ts';

interface TestCase {
  /**
   * Additional parser configuration
   */
  additionalConfig: Parameters<typeof parseSearch>[1];
  /**
   * The search query string under parsing test
   */
  query: string;
  /**
   * The expected result for the query
   */
  result: ParseResult;
  /**
   * This is set when the query is expected to completely fail to parse.
   */
  raisesError?: boolean;
}

/**
 * Normalize results to match the json test cases (in features/syntax)
 */
const normalizeResult = (tokens: TokenResult<Token>[]) =>
  treeTransformer({
    tree: tokens,
    transform: token => {
      // XXX: This attempts to keep the test data simple, only including keys
      // that are really needed to validate functionality.

      // @ts-expect-error ignore
      delete token.location;
      // @ts-expect-error ignore
      delete token.text;
      // @ts-expect-error ignore
      delete token.config;

      // token warnings only exist in the FE atm
      // @ts-expect-error ignore
      delete token.warning;

      if (token.type === Token.FILTER && token.invalid === null) {
        // @ts-expect-error ignore
        delete token.invalid;
      }

      if (token.type === Token.VALUE_ISO_8601_DATE || token.type === Token.VALUE_RELATIVE_DATE) {
        if (token.parsed?.value instanceof Date) {
          // @ts-expect-error we cannot have dates in JSON
          token.parsed.value = token.parsed.value.toISOString();
        }
      }

      return token;
    },
  });

const prepSearchConfig = (config?: Partial<SearchConfig>): Partial<SearchConfig> | undefined => {
  if (!config) return config;

  for (const key in config) {
    // Turn primitive arrays from the json fixtures into the expected sets
    if (Array.isArray(config[key])) {
      config[key] = new Set(config[key]);
    }
  }

  return config;
};

const defaultConfig: Partial<SearchConfig> = {
  textOperatorKeys: new Set(['release.version', 'release.build', 'release.package', 'release.stage']),
  durationKeys: new Set(['transaction.duration']),
  percentageKeys: new Set(['percentage']),
  // do not put functions in this Set
  numericKeys: new Set([
    'project_id',
    'project.id',
    'issue.id',
    'stack.colno',
    'stack.lineno',
    'stack.stack_level',
    'transaction.duration',
  ]),
  dateKeys: new Set([
    'start',
    'end',
    'firstSeen',
    'lastSeen',
    'last_seen()',
    'time',
    'event.timestamp',
    'timestamp',
    'timestamp.to_hour',
    'timestamp.to_day',
  ]),
  booleanKeys: new Set(['error.handled', 'error.unhandled', 'stack.in_app', 'team_key_transaction']),
};

describe('parser', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();

    const date = new Date(2024, 3, 26, 10, 30, 0);
    vi.setSystemTime(date);
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  const testData = loadFixtures<TestCase>(__dirname, 'fixtures/syntax', {
    // To hone in on specific test cases, add the file name(s) here
    allowList: [],
    // To ignore specific test cases, add the file name(s) here
    denyList: [],
  });

  const registerTestCase = (testCase: TestCase, additionalConfig: Partial<SearchConfig> = {}) =>
    it(`handles ${testCase.query}`, () => {
      const result = parseSearch(testCase.query, {
        ...defaultConfig,
        ...prepSearchConfig(testCase.additionalConfig),
        ...additionalConfig,
      });
      // Handle errors
      if (testCase.raisesError) {
        expect(result).toBeNull();
        return;
      }

      if (result === null) {
        throw new Error('Parsed result as null without raiseError true');
      }

      expect(normalizeResult(result)).toEqual(testCase.result);
    });

  Object.entries(testData).map(([name, cases]) =>
    describe(`${name}`, () => {
      cases.map(c => registerTestCase(c, { parse: true }));
    }),
  );

  it('returns token warnings', () => {
    const result = parseSearch('foo:bar bar:baz tags[foo]:bar tags[bar]:baz', {
      ...defaultConfig,
      getFilterTokenWarning: key => (key === 'foo' ? 'foo warning' : null),
    });

    // check with error to satisfy type checker
    if (result === null) {
      throw new Error('Parsed result as null');
    }
    expect(result).toHaveLength(9);

    const foo = result[1] as TokenResult<Token.FILTER>;
    const bar = result[3] as TokenResult<Token.FILTER>;
    const fooTag = result[5] as TokenResult<Token.FILTER>;
    const barTag = result[7] as TokenResult<Token.FILTER>;

    expect(foo.warning).toBe('foo warning');
    expect(bar.warning).toBe(null);
    expect(fooTag.warning).toBe('foo warning');
    expect(barTag.warning).toBe(null);
  });

  it('applies disallowFreeText', () => {
    const result = parseSearch('foo:bar test', {
      ...defaultConfig,
      disallowFreeText: true,
      invalidMessages: {
        [InvalidReason.FREE_TEXT_NOT_ALLOWED]: 'Custom message',
      },
    });

    // check with error to satisfy type checker
    if (result === null) {
      throw new Error('Parsed result as null');
    }
    expect(result).toHaveLength(5);

    const foo = result[1] as TokenResult<Token.FILTER>;
    const test = result[3] as TokenResult<Token.FREE_TEXT>;

    expect(foo.invalid).toBe(null);
    expect(test.invalid).toEqual({
      type: InvalidReason.FREE_TEXT_NOT_ALLOWED,
      reason: 'Custom message',
    });
  });

  it('applies disallowLogicalOperators (OR)', () => {
    const result = parseSearch('foo:bar OR AND', {
      ...defaultConfig,
      disallowedLogicalOperators: new Set([BooleanOperator.OR]),
      invalidMessages: {
        [InvalidReason.LOGICAL_OR_NOT_ALLOWED]: 'Custom message',
      },
    });

    // check with error to satisfy type checker
    if (result === null) {
      throw new Error('Parsed result as null');
    }
    expect(result).toHaveLength(7);

    const foo = result[1] as TokenResult<Token.FILTER>;
    const or = result[3] as TokenResult<Token.LOGIC_BOOLEAN>;
    const and = result[5] as TokenResult<Token.LOGIC_BOOLEAN>;

    expect(foo.invalid).toBe(null);
    expect(or.invalid).toEqual({
      type: InvalidReason.LOGICAL_OR_NOT_ALLOWED,
      reason: 'Custom message',
    });
    expect(and.invalid).toBe(null);
  });

  it('applies disallowLogicalOperators (AND)', () => {
    const result = parseSearch('foo:bar OR AND', {
      ...defaultConfig,
      disallowedLogicalOperators: new Set([BooleanOperator.AND]),
      invalidMessages: {
        [InvalidReason.LOGICAL_AND_NOT_ALLOWED]: 'Custom message',
      },
    });

    // check with error to satisfy type checker
    if (result === null) {
      throw new Error('Parsed result as null');
    }
    expect(result).toHaveLength(7);

    const foo = result[1] as TokenResult<Token.FILTER>;
    const or = result[3] as TokenResult<Token.LOGIC_BOOLEAN>;
    const and = result[5] as TokenResult<Token.LOGIC_BOOLEAN>;

    expect(foo.invalid).toBe(null);
    expect(or.invalid).toBe(null);
    expect(and.invalid).toEqual({
      type: InvalidReason.LOGICAL_AND_NOT_ALLOWED,
      reason: 'Custom message',
    });
  });
});
