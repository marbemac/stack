import type { Rules, Token } from 'moo';
import moo from 'moo';

export interface LexerToken<T extends LexerTypes = LexerTypes> extends Token {
  type: T;
}

export interface SimpleLexerToken<T extends LexerTypes = LexerTypes> extends Pick<Token, 'value'> {}

type StatesT = typeof STATES;
export type LexerTypes =
  | keyof StatesT['main']
  | keyof StatesT['qualifier']
  | keyof StatesT['literalQualifier']
  | keyof StatesT['multiValQualifier'];

export type LexerQualOps = (typeof QUAL_OPS)[number];

const qualVal = { match: /[a-zA-Z0-9@_\-\\.]+/, value: (s: string) => s.trimStart() };
const qualValWithSpace = { match: /[a-zA-Z0-9@_\s\\.]+/, value: (s: string) => s.trimStart(), lineBreaks: true };

const QUAL_OPS = ['>', '<', '>=', '<='] as const;
const qualOp = { match: [...QUAL_OPS] };

const STATES = {
  main: {
    qualKey: {
      match: /[a-zA-Z0-9\-_\\.]+:/,
      push: 'qualifier',
      // remove the : from the end
      value: s => s.slice(0, -1),
    },
    string: { match: /[a-zA-Z0-9_\\.]+/ },
    space: { match: /\s+/, lineBreaks: true },
  } satisfies Rules,

  qualifier: {
    quote: { match: '"', next: 'literalQualifier' },
    lbracket: { match: '[', next: 'multiValQualifier' },
    qualOp: { ...qualOp },
    qualVal: { ...qualVal, pop: 1 },
  } satisfies Rules,

  literalQualifier: {
    qualOp: { ...qualOp },
    qualVal: { ...qualValWithSpace, lineBreaks: true },
    quote: { match: '"', pop: 1 },
  } satisfies Rules,

  multiValQualifier: {
    qualOp: { ...qualOp },
    qualVal: { ...qualValWithSpace, lineBreaks: true },
    comma: ',',
    rbracket: { match: ']', pop: 1 },
  } satisfies Rules,
};

export const createLexer = () => {
  return moo.states(STATES);
};
