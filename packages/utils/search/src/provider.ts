import { createContext, useContext } from 'solid-js';

import type { SearchQuery } from './search-query.ts';

type SearchQueryContext = {
  search: SearchQuery;
};

export const SearchQueryContext = createContext<SearchQueryContext>();

export function useSearchQuery() {
  const context = useContext(SearchQueryContext);

  if (context === undefined) {
    throw new Error('`useSearchQuery` must be used within a `SearchQueryContext.Provider`');
  }

  return context;
}
