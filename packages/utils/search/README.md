# @marbemac/utils-search

Functions for parsing and transforming search strings.

If the grammar in `./src/grammar.ne` is updated, run `yarn workspace @marbemac/utils-search build.grammar` to re-build.

## Search Examples

The search syntax is inspired primarily by GitHub
(https://docs.github.com/en/search-github/github-code-search/understanding-github-code-search-syntax) and Sentry
(https://docs.sentry.io/product/sentry-basics/search).

```bash
# qualifiers (by default, "and")
plan:free country:us

# multi-value qualifiers ("or")
plan:[free, enterprise]

# operators
num_members:>=5

# quoted literals
name:"john doe"
```

## Library Usage

```ts
import { createSearchQuery } from '@marbemac/utils-search';

const s = createSearchQuery();

// Query defaults to an empty string
console.log(s.query); // ''

s.setQuery('user:john');
console.log(s.query); // 'user:john"

s.addQualifier({ key: 'user', val: 'marc' }, { replace: true });
console.log(s.query); // 'user:marc"

s.addQualifier({ key: 'user', val: 'marc' }, { toggle: true });
s.addQualifier({ key: 'plan', val: 'free' });
s.addQualifier({ key: 'num_members', val: 5, op: '>' });
console.log(s.query); // 'plan:free num_members:>5"

s.removeQualifier({ key: 'num_members' });
console.log(s.query); // 'plan:free"

console.log(s.isQualifierActive('plan')); // true
console.log(s.isQualifierActive('plan', 'rando')); // false
```
