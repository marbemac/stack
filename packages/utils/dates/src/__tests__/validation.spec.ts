import { expect, it } from 'vitest';

import { isValidDate } from '../validation.ts';

it.each`
  maybeDate                                                            | expected
  ${'2012-04-12'}                                                      | ${true}
  ${'2015/5/2'}                                                        | ${true}
  ${'2018-04-04T16:00:00.000Z'}                                        | ${true}
  ${'blah'}                                                            | ${false}
  ${1683921911305}                                                     | ${false}
  ${'https://xyz.io/studio/2'}                                         | ${false}
  ${'https://xyz.io/docs/foo/b074dc47b2826-bar-configuration-options'} | ${false}
`('getRootDomain($maybeDate) -> $expected', ({ maybeDate, expected }) => {
  expect(isValidDate(maybeDate)).toBe(expected);
});
