import type { SetOptional } from '@marbemac/utils-types';
import { batch } from 'solid-js';
import { createStore, produce, reconcile } from 'solid-js/store';

import type { ParseResult, QualifierOp, QualifierToken, RawToken, SimpleParseResult } from './parse.ts';
import { isRawToken } from './parse.ts';
import { parseSearchQuery } from './parse.ts';
import { stringifySearchQuery } from './stringify.ts';
import type { QualifierInput } from './transform.ts';
import { findQualifierWithValue } from './transform.ts';
import { removeQualifier } from './transform.ts';
import { addQualifier } from './transform.ts';
import type { SearchString } from './types.ts';

export interface SearchQuery {
  readonly query: SearchString;
  readonly parsedQuery: ParseResult<'default'>;
  readonly activeQualifiers: string[];
  setQuery(query: SearchString | string): void;
  isQualifierActive: (key: string, val?: unknown, op?: QualifierOp) => boolean;
  addQualifier: (qualifier: QualifierInput, opts?: SetQualifierOpts) => void;
  removeQualifier: (qualifier: SetOptional<QualifierInput, 'val'>) => void;
}

interface CreateSearchQueryOpts {
  initialQuery?: SearchString | string;
  onQueryChange?: (props: { newQuery: SearchString }) => void;
}

interface SearchStore {
  rawQuery: string;
  parsedQuery: ParseResult<'default'>;
  qualifierMap: QualifierMap;
  rawTokens: RawToken[];
}

interface QualifierMapItem {
  index: number;
  token: QualifierToken;
}

interface SetQualifierOpts {
  replace?: boolean;
  toggle?: boolean;
  or?: boolean;
}

type QualifierMap = Record<string, QualifierMapItem[]>;

export const createSearchQuery = ({ initialQuery, onQueryChange }: CreateSearchQueryOpts = {}) => {
  const initialParsedQuery = initialQuery ? parseSearchQuery(initialQuery as SearchString) : emptyParsedQuery();
  const { qualifierMap: initialQualifierMap, rawTokens: initialRawTokens } = computeTokenMaps(initialParsedQuery);

  const [state, setState] = createStore<SearchStore>({
    rawQuery: initialQuery || '',
    parsedQuery: initialParsedQuery,
    qualifierMap: initialQualifierMap,
    rawTokens: initialRawTokens,
  });

  function setQuery(query: string) {
    if (query === state.rawQuery) return;

    const q = query as SearchString; // could do some quick checks here if we wanted...
    const parsed = parseSearchQuery(q);
    const { qualifierMap, rawTokens } = computeTokenMaps(parsed);

    batch(() => {
      setState({ rawQuery: q, parsedQuery: parsed, rawTokens });
      setState('qualifierMap', reconcile(qualifierMap));
    });

    if (onQueryChange) onQueryChange({ newQuery: q });
  }

  const getQualifier = (qualifierKey: string) => state.qualifierMap[qualifierKey];

  const findQualifierByKeyVal = (key: string, val: unknown, op?: QualifierOp) => {
    const target = getQualifier(key);
    if (!target) return false;

    return findQualifierWithValue(
      target.map(t => t.token),
      val,
      op,
    );
  };

  function recomputeQuery() {
    setQuery(stringifySearchQuery(state.parsedQuery).query);
  }

  const instance: SearchQuery = {
    get query() {
      return state.rawQuery as SearchString;
    },

    get parsedQuery() {
      return state.parsedQuery;
    },

    get activeQualifiers() {
      return Object.keys(state.qualifierMap);
    },

    setQuery(val) {
      setQuery(val);
    },

    isQualifierActive(key, val, op) {
      if (val === undefined) {
        // just looking based on key...
        return !!getQualifier(key);
      }

      return !!findQualifierByKeyVal(key, val, op);
    },

    addQualifier(qualifier, opts = {}) {
      setState(
        produce(s => {
          addQualifier((s.parsedQuery as SimpleParseResult).tokens, qualifier, opts);
        }),
      );

      recomputeQuery();
    },

    removeQualifier(qualifier) {
      const existing = getQualifier(qualifier.key);
      if (!existing) return;

      setState(
        produce(s => {
          removeQualifier((s.parsedQuery as SimpleParseResult).tokens, qualifier);
        }),
      );

      recomputeQuery();
    },
  };

  return instance;
};

const emptyParsedQuery = (): ParseResult => ({
  tokens: [],
});

const computeTokenMaps = (parsedQuery: ParseResult) => {
  const rawTokens: RawToken[] = [];
  const qualifierMap: QualifierMap = {};

  for (const index in parsedQuery.tokens) {
    const token = parsedQuery.tokens[index];
    if (!token) continue;

    if (isRawToken(token)) {
      rawTokens.push(token);
    } else {
      qualifierMap[token.key.value] ||= [];
      qualifierMap[token.key.value]!.push({
        index: Number(index),
        token,
      });
    }
  }

  return { rawTokens, qualifierMap };
};
