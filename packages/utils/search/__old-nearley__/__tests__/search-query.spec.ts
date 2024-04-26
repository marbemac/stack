import { createEffect, createRoot, createSignal, on } from 'solid-js';
import type { Mock } from 'vitest';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { createSearchQuery } from '../search-query.ts';

describe('.query', () => {
  it('works', () => {
    const q = createSearchQuery({ initialQuery: 'hello' });

    expect(q.query).toEqual('hello');
  });
});

describe('addQualifier()', () => {
  describe('default behavior', () => {
    it('works', () => {
      const q = createSearchQuery();

      q.addQualifier({ key: 'user', val: 'marc' });

      expect(q.query).toEqual('user:marc');
    });

    it('does not add duplicates when key and value are the same', () => {
      const q = createSearchQuery({ initialQuery: 'user:marc' });

      q.addQualifier({ key: 'user', val: 'marc' });

      expect(q.query).toEqual('user:marc');
    });

    it('stringifies value before comparison', () => {
      const q = createSearchQuery({ initialQuery: 'num_members:>1' });

      // note how val is a number here (not '1' string)
      q.addQualifier({ key: 'num_members', op: '>', val: 1 });

      expect(q.query).toEqual('num_members:>1');
    });

    it('adds additional if values are different', () => {
      const q = createSearchQuery({ initialQuery: 'num_members:<100' });

      q.addQualifier({ key: 'num_members', op: '>', val: 0 });

      expect(q.query).toEqual('num_members:<100 num_members:>0');
    });

    it('co-locates with same key qualifiers if possible', () => {
      const q = createSearchQuery({ initialQuery: 'num_members:<100 name:marc' });

      q.addQualifier({ key: 'num_members', op: '>', val: 0 });

      expect(q.query).toEqual('num_members:<100 num_members:>0 name:marc');
    });
  });

  describe('toggle=true', () => {
    it('add the qualifier when key and value are not the same', () => {
      const q = createSearchQuery({ initialQuery: 'name:marc' });

      q.addQualifier({ key: 'name', val: 'joe' }, { toggle: true });

      expect(q.query).toEqual('name:marc name:joe');
    });

    it('removes the qualifier when key and value are the same', () => {
      const q = createSearchQuery({ initialQuery: 'name:marc' });

      q.addQualifier({ key: 'name', val: 'marc' }, { toggle: true });

      expect(q.query).toEqual('');
    });
  });

  describe('replace=true', () => {
    it('replaces last occurrance of the qualifier when key already exists, preserving position', () => {
      const q = createSearchQuery({ initialQuery: 'num_members:>1 num_members:>2' });

      q.addQualifier({ key: 'num_members', op: '<', val: 3 }, { replace: true });

      expect(q.query).toEqual('num_members:>1 num_members:<3');
    });
  });

  describe('toggle=true and replace=true', () => {
    it('replaces last occurrance of the qualifier when key already exists, preserving position', () => {
      const q = createSearchQuery({ initialQuery: 'num_members:>1 num_members:>2' });

      q.addQualifier({ key: 'num_members', op: '<', val: 3 }, { replace: true, toggle: true });

      expect(q.query).toEqual('num_members:>1 num_members:<3');
    });

    it('removes if key value match, ignoring op', () => {
      const q = createSearchQuery({ initialQuery: 'num_members:>1 num_members:>2' });

      q.addQualifier({ key: 'num_members', op: '<', val: 1 }, { replace: true, toggle: true });

      expect(q.query).toEqual('num_members:>2');
    });
  });

  describe('or=true', () => {
    it('does not use [] syntax if this is the only occurance', () => {
      const q = createSearchQuery();

      q.addQualifier({ key: 'plan', val: 'free' }, { or: true });

      expect(q.query).toEqual('plan:free');
    });

    it('groups into [] syntax if this key is already present', () => {
      const q = createSearchQuery({ initialQuery: 'plan:free' });

      q.addQualifier({ key: 'plan', val: 'starter' }, { or: true });

      expect(q.query).toEqual('plan:[free, starter]');
    });

    it('does not add duplicates', () => {
      const q = createSearchQuery({ initialQuery: 'plan:[free, starter]' });

      q.addQualifier({ key: 'plan', val: 'starter' }, { or: true });

      expect(q.query).toEqual('plan:[free, starter]');
    });

    it('toggles if toggle=true', () => {
      const q = createSearchQuery({ initialQuery: 'plan:[free, starter]' });

      q.addQualifier({ key: 'plan', val: 'starter' }, { or: true, toggle: true });

      expect(q.query).toEqual('plan:free');
    });
  });
});

describe('removeQualifier()', () => {
  it('removes all instances of the qualifier if val not provided', () => {
    const q = createSearchQuery({ initialQuery: 'user:marc plan:free user:john' });

    q.removeQualifier({ key: 'user' });

    expect(q.query).toEqual('plan:free');
  });

  it('removes specific instance if val provided', () => {
    const q = createSearchQuery({ initialQuery: 'user:marc plan:free user:john' });

    q.removeQualifier({ key: 'user', val: 'marc' });

    expect(q.query).toEqual('plan:free user:john');
  });

  it('supports multi val', () => {
    const q = createSearchQuery({ initialQuery: 'plan:[free, starter]' });

    q.removeQualifier({ key: 'plan', val: 'free' });

    expect(q.query).toEqual('plan:starter');
  });
});

describe('isQualifierActive()', () => {
  describe('key only', () => {
    it('works', async () => {
      const q = createSearchQuery({ initialQuery: 'plan:free' });

      q.addQualifier({ key: 'user', val: 'marc' });

      expect(q.isQualifierActive('user')).toBe(true);

      q.removeQualifier({ key: 'user', val: 'marc' });

      expect(q.isQualifierActive('user')).toBe(false);
      expect(q.isQualifierActive('plan')).toBe(true);
    });

    it('should only trigger updates when target qualifier key is added or removed', () => {
      const qualKey = 'user';

      const { dispose, q, counter } = createRoot(dispose => {
        const q = createSearchQuery({ initialQuery: 'plan:free' });

        const [counter, setCounter] = createSignal(0);

        createEffect(
          on(
            () => q.isQualifierActive(qualKey),
            () => setCounter(counter() + 1),
            { defer: true },
          ),
        );

        return { dispose, q, counter };
      });

      q.addQualifier({ key: qualKey, val: 'marc' });

      expect(counter()).toBe(1);

      // adding a different key should not trigger updates
      q.addQualifier({ key: 'plan', val: 'free' });

      expect(counter()).toBe(1);

      // replacing the value should not trigger updates
      q.addQualifier({ key: qualKey, val: 'marc2' }, { replace: true });

      expect(counter()).toBe(1);

      // adding an additional value should not trigger updates
      q.addQualifier({ key: qualKey, val: 'john' });

      expect(counter()).toBe(1);

      // removing the key should trigger updates
      q.removeQualifier({ key: qualKey });

      expect(counter()).toBe(2);

      dispose();
    });
  });

  describe('key + val + op?', () => {
    it('return true if key and val are active', async () => {
      const q = createSearchQuery({ initialQuery: 'plan:free' });

      expect(q.isQualifierActive('plan', 'free')).toBe(true);
    });

    it('return false if key is active but val does not match', async () => {
      const q = createSearchQuery({ initialQuery: 'plan:free' });

      expect(q.isQualifierActive('plan', 'starter')).toBe(false);
    });

    it('supports multi val', async () => {
      const q = createSearchQuery({ initialQuery: 'plan:[free, starter]' });

      expect(q.isQualifierActive('plan', 'free')).toBe(true);
      expect(q.isQualifierActive('plan', 'starter')).toBe(true);
    });

    it('compares by string', async () => {
      const q = createSearchQuery({ initialQuery: 'num_members:5' });

      expect(q.isQualifierActive('num_members', 5)).toBe(true);
    });

    it('supports specifying a specific op', async () => {
      const q = createSearchQuery({ initialQuery: 'num_members:>5' });

      expect(q.isQualifierActive('num_members', '5', '=')).toBe(false);
      expect(q.isQualifierActive('num_members', '5', '>')).toBe(true);
    });
  });
});

describe('onQueryChange', () => {
  let onQueryChange: Mock;

  beforeAll(() => {
    onQueryChange = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is triggered when query changes, with the new query val', async () => {
    const q = createSearchQuery({ initialQuery: 'plan:free', onQueryChange });

    q.setQuery('plan:starter');

    expect(onQueryChange).toHaveBeenCalledOnce();
    expect(onQueryChange).toHaveBeenLastCalledWith({ newQuery: 'plan:starter' });
  });

  it('is triggered when qualifier changed', async () => {
    const q = createSearchQuery({ initialQuery: 'plan:free', onQueryChange });

    q.addQualifier({ key: 'plan', val: 'starter' });

    expect(onQueryChange).toHaveBeenCalledOnce();
  });

  it('is not triggered if query unchanged', async () => {
    const q = createSearchQuery({ initialQuery: 'plan:free', onQueryChange });

    q.addQualifier({ key: 'plan', val: 'free' });

    expect(onQueryChange).not.toHaveBeenCalled();

    q.setQuery('plan:free');

    expect(onQueryChange).not.toHaveBeenCalled();
  });
});
