# @marbemac/utils-search

Functions for parsing and transforming a search query syntax. Leverages the
[Chevrotain](https://github.com/Chevrotain/chevrotain).

If the grammar in `./src/grammar/parser.ts` is updated, run `yarn workspace @marbemac/utils-search build.grammar-types`
to re-build the types.

## Search Examples

The search syntax is inspired primarily by
[GitHub](https://docs.github.com/en/search-github/github-code-search/understanding-github-code-search-syntax) and
[Sentry](https://docs.sentry.io/product/sentry-basics/search). .

```bash
# free form
john

# qualifiers ("and" by default)
plan:free country:us

# multi-value qualifiers ("in/or")
plan:[free, enterprise]

# operators
num_members:>=5

# negation
!plan:free

# quoted literals
name:"john doe" "freeform quoted literal"

# functions
count():>5 divide(one, two)

# functions with nested filters
count_if(companies, plan:free country:"united states")
```

## Library Usage

@TODO this is the old nearley based usage. To update once the manipulation API is in place.

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
