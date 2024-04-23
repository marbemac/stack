import { expect, it } from 'vitest';

import { parseDatabaseUrl } from '../parse-database-url.ts';

it.each`
  url                                                 | host                | hostname       | port         | username     | password     | database
  ${'http://localhost'}                               | ${'localhost'}      | ${'localhost'} | ${undefined} | ${undefined} | ${undefined} | ${undefined}
  ${'postgres://localhost:8080/db'}                   | ${'localhost:8080'} | ${'localhost'} | ${8080}      | ${undefined} | ${undefined} | ${'db'}
  ${'postgres://user:pass@localhost:8080/db?foo=bar'} | ${'localhost:8080'} | ${'localhost'} | ${8080}      | ${'user'}    | ${'pass'}    | ${'db'}
  ${'redis://user:pass@localhost:8080/0?foo=bar'}     | ${'localhost:8080'} | ${'localhost'} | ${8080}      | ${'user'}    | ${'pass'}    | ${'0'}
`('parseDatabaseUrl($url)', ({ url, ...result }) => {
  expect(parseDatabaseUrl(url)).toEqual(result);
});
