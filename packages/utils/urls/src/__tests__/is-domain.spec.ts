import { expect, it } from 'vitest';

import { isDomain } from '../is-domain.ts';

it.each`
  maybeDomain            | expected
  ${'gucci.com'}         | ${true}
  ${'team.blue'}         | ${true}
  ${'team-99.blue'}      | ${true}
  ${'sub.wefox.com'}     | ${true}
  ${'sub.ext.wefox.com'} | ${true}
  ${'sub'}               | ${false}
  ${'joe@sub.com'}       | ${false}
`('getRootDomain($maybeDomain) -> $expected', ({ maybeDomain, expected }) => {
  expect(isDomain(maybeDomain)).toBe(expected);
});
