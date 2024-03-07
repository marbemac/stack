import { expect, it } from 'vitest';

import { getRootDomain } from '../get-root-domain.ts';

it.each([
  ['non.se.com', 'se.com'],
  ['ext.wefox.com', 'wefox.com'],
  ['sub.ext.wefox.com', 'wefox.com'],
  ['students.oamk.fi', 'oamk.fi'],
  ['team.blue', 'team.blue'],
  ['avamae.co.uk', 'avamae.co.uk'],
  ['pexa.com.au', 'pexa.com.au'],
  ['sub.pexa.com.au', 'pexa.com.au'],
])('getRootDomain(%s) -> %s', (a, expected) => {
  expect(getRootDomain(a)).toBe(expected);
});
