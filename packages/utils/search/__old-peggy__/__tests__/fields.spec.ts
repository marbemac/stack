import { describe, expect, it } from 'vitest';

import { getAggregateAlias, isAggregateField, parseFunction } from '../fields.ts';

describe('parseFunction', () => {
  it('returns null on non aggregate fields', () => {
    expect(parseFunction('field')).toEqual(null);
    expect(parseFunction('under_field')).toEqual(null);
    expect(parseFunction('foo.bar.is-Enterprise_42')).toEqual(null);
  });

  it('handles 0 arg functions', () => {
    expect(parseFunction('count()')).toEqual({
      name: 'count',
      arguments: [],
    });
    expect(parseFunction('count_unique()')).toEqual({
      name: 'count_unique',
      arguments: [],
    });
  });

  it('handles 1 arg functions', () => {
    expect(parseFunction('count(id)')).toEqual({
      name: 'count',
      arguments: ['id'],
    });
    expect(parseFunction('count_unique(user)')).toEqual({
      name: 'count_unique',
      arguments: ['user'],
    });
    expect(parseFunction('count_unique(issue.id)')).toEqual({
      name: 'count_unique',
      arguments: ['issue.id'],
    });
    expect(parseFunction('count(foo.bar.is-Enterprise_42)')).toEqual({
      name: 'count',
      arguments: ['foo.bar.is-Enterprise_42'],
    });
  });

  it('handles 2 arg functions', () => {
    expect(parseFunction('percentile(transaction.duration,0.81)')).toEqual({
      name: 'percentile',
      arguments: ['transaction.duration', '0.81'],
    });
    expect(parseFunction('percentile(transaction.duration,  0.11)')).toEqual({
      name: 'percentile',
      arguments: ['transaction.duration', '0.11'],
    });
  });

  it('handles 3 arg functions', () => {
    expect(parseFunction('count_if(transaction.duration,greater,0.81)')).toEqual({
      name: 'count_if',
      arguments: ['transaction.duration', 'greater', '0.81'],
    });
    expect(parseFunction('count_if(some_tag,greater,"0.81,123,152,()")')).toEqual({
      name: 'count_if',
      arguments: ['some_tag', 'greater', '"0.81,123,152,()"'],
    });
    expect(parseFunction('function(foo, bar, baz)')).toEqual({
      name: 'function',
      arguments: ['foo', 'bar', 'baz'],
    });
  });

  it('handles 4 arg functions', () => {
    expect(parseFunction('to_other(release,"0.81,123,152,()",others,current)')).toEqual({
      name: 'to_other',
      arguments: ['release', '"0.81,123,152,()"', 'others', 'current'],
    });
  });
});

describe('getAggregateAlias', function () {
  it('no-ops simple fields', function () {
    expect(getAggregateAlias('field')).toEqual('field');
    expect(getAggregateAlias('under_field')).toEqual('under_field');
    expect(getAggregateAlias('foo.bar.is-Enterprise_42')).toEqual('foo.bar.is-Enterprise_42');
  });

  it('handles 0 arg functions', function () {
    expect(getAggregateAlias('count()')).toEqual('count');
    expect(getAggregateAlias('count_unique()')).toEqual('count_unique');
  });

  it('handles 1 arg functions', function () {
    expect(getAggregateAlias('count(id)')).toEqual('count_id');
    expect(getAggregateAlias('count_unique(user)')).toEqual('count_unique_user');
    expect(getAggregateAlias('count_unique(issue.id)')).toEqual('count_unique_issue_id');
    expect(getAggregateAlias('count(foo.bar.is-Enterprise_42)')).toEqual('count_foo_bar_is_Enterprise_42');
  });

  it('handles 2 arg functions', function () {
    expect(getAggregateAlias('percentile(transaction.duration,0.81)')).toEqual('percentile_transaction_duration_0_81');
    expect(getAggregateAlias('percentile(transaction.duration,  0.11)')).toEqual(
      'percentile_transaction_duration_0_11',
    );
  });

  it('handles to_other with symbols', function () {
    expect(getAggregateAlias('to_other(release,"release:beta@1.1.1 (2)",others,current)')).toEqual(
      'to_other_release__release_beta_1_1_1__2___others_current',
    );
  });
});

describe('isAggregateField', function () {
  it('detects aliases', function () {
    expect(isAggregateField('p888')).toBe(false);
    expect(isAggregateField('other_field')).toBe(false);
    expect(isAggregateField('foo.bar.is-Enterprise_42')).toBe(false);
  });

  it('detects functions', function () {
    expect(isAggregateField('count()')).toBe(true);
    expect(isAggregateField('p75()')).toBe(true);
    expect(isAggregateField('percentile(transaction.duration, 0.55)')).toBe(true);
    expect(isAggregateField('last_seen()')).toBe(true);
    expect(isAggregateField('thing(')).toBe(false);
    expect(isAggregateField('unique_count(user)')).toBe(true);
    expect(isAggregateField('unique_count(foo.bar.is-Enterprise_42)')).toBe(true);
  });
});
