import { expect, it } from 'vitest';

import { safeParse } from '../safe-parse.ts';

it('should work', () => {
  const val = '{"foo":true}';
  expect(safeParse(val)).toEqual({ foo: true });

  // should return undefined on error
  expect(safeParse('{')).toEqual(undefined);

  expect(safeParse({ foo: true })).toEqual({ foo: true });
});
