/* eslint-disable */
// @ts-nocheck
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0];
}
declare var qualKey: any;
declare var qualOp: any;
declare var qualVal: any;
declare var quote: any;
declare var lbracket: any;
declare var rbracket: any;
declare var comma: any;
declare var string: any;
declare var space: any;

import { createLexer } from './lexer.ts';

const lexer = createLexer();

function transformMain([tokens]) {
  const noFalsey = [];
  for (const f of tokens) {
    if (f[0]) {
      noFalsey.push(f[0]);
    }
  }

  return {
    tokens: noFalsey,
  };
}

interface NearleyToken {
  value: any;
  [key: string]: any;
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
}

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
}

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    { name: 'Main$ebnf$1', symbols: [] },
    { name: 'Main$ebnf$1$subexpression$1', symbols: ['Qual'] },
    { name: 'Main$ebnf$1$subexpression$1', symbols: ['_'] },
    { name: 'Main$ebnf$1$subexpression$1', symbols: ['Raw'] },
    {
      name: 'Main$ebnf$1',
      symbols: ['Main$ebnf$1', 'Main$ebnf$1$subexpression$1'],
      postprocess: d => d[0].concat([d[1]]),
    },
    { name: 'Main', symbols: ['Main$ebnf$1'], postprocess: transformMain },
    { name: 'Qual$ebnf$1', symbols: ['QualVal'], postprocess: id },
    { name: 'Qual$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'Qual',
      symbols: ['QualKey', 'Qual$ebnf$1'],
      postprocess: ([key, val]) => ({ key, op: '=', val: val || '' }),
    },
    { name: 'Qual$ebnf$2', symbols: ['QualVal'], postprocess: id },
    { name: 'Qual$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'Qual',
      symbols: ['QualKey', 'QualOp', 'Qual$ebnf$2'],
      postprocess: ([key, op, val]) => ({ key, op: op.value, val: val || '' }),
    },
    { name: 'Qual$ebnf$3', symbols: ['QualVal'], postprocess: id },
    { name: 'Qual$ebnf$3', symbols: [], postprocess: () => null },
    { name: 'Qual$ebnf$4', symbols: ['Quote'], postprocess: id },
    { name: 'Qual$ebnf$4', symbols: [], postprocess: () => null },
    {
      name: 'Qual',
      symbols: ['QualKey', 'Quote', 'Qual$ebnf$3', 'Qual$ebnf$4'],
      postprocess: ([key, , val]) => ({ key, op: '=', val: val || '' }),
    },
    { name: 'Qual$ebnf$5', symbols: ['QualMultiVal'], postprocess: id },
    { name: 'Qual$ebnf$5', symbols: [], postprocess: () => null },
    { name: 'Qual$ebnf$6', symbols: ['RBracket'], postprocess: id },
    { name: 'Qual$ebnf$6', symbols: [], postprocess: () => null },
    {
      name: 'Qual',
      symbols: ['QualKey', 'LBracket', 'Qual$ebnf$5', 'Qual$ebnf$6'],
      postprocess: ([key, , val]) => ({ key, op: '=', val: val || '' }),
    },
    { name: 'QualKey', symbols: [lexer.has('qualKey') ? { type: 'qualKey' } : qualKey], postprocess: id },
    { name: 'QualOp', symbols: [lexer.has('qualOp') ? { type: 'qualOp' } : qualOp], postprocess: id },
    { name: 'QualVal', symbols: [lexer.has('qualVal') ? { type: 'qualVal' } : qualVal], postprocess: id },
    { name: 'QualMultiVal$ebnf$1$subexpression$1$ebnf$1', symbols: ['Comma'], postprocess: id },
    { name: 'QualMultiVal$ebnf$1$subexpression$1$ebnf$1', symbols: [], postprocess: () => null },
    { name: 'QualMultiVal$ebnf$1$subexpression$1', symbols: ['QualVal', 'QualMultiVal$ebnf$1$subexpression$1$ebnf$1'] },
    { name: 'QualMultiVal$ebnf$1', symbols: ['QualMultiVal$ebnf$1$subexpression$1'] },
    { name: 'QualMultiVal$ebnf$1$subexpression$2$ebnf$1', symbols: ['Comma'], postprocess: id },
    { name: 'QualMultiVal$ebnf$1$subexpression$2$ebnf$1', symbols: [], postprocess: () => null },
    { name: 'QualMultiVal$ebnf$1$subexpression$2', symbols: ['QualVal', 'QualMultiVal$ebnf$1$subexpression$2$ebnf$1'] },
    {
      name: 'QualMultiVal$ebnf$1',
      symbols: ['QualMultiVal$ebnf$1', 'QualMultiVal$ebnf$1$subexpression$2'],
      postprocess: d => d[0].concat([d[1]]),
    },
    { name: 'QualMultiVal', symbols: ['QualMultiVal$ebnf$1'], postprocess: ([val]) => val.map(v => v[0]) },
    { name: 'Quote', symbols: [lexer.has('quote') ? { type: 'quote' } : quote], postprocess: () => null },
    { name: 'LBracket', symbols: [lexer.has('lbracket') ? { type: 'lbracket' } : lbracket], postprocess: () => null },
    { name: 'RBracket', symbols: [lexer.has('rbracket') ? { type: 'rbracket' } : rbracket], postprocess: () => null },
    { name: 'Comma', symbols: [lexer.has('comma') ? { type: 'comma' } : comma], postprocess: () => null },
    { name: 'Raw', symbols: [lexer.has('string') ? { type: 'string' } : string], postprocess: id },
    { name: '_', symbols: [lexer.has('space') ? { type: 'space' } : space], postprocess: () => null },
  ],
  ParserStart: 'Main',
};

export default grammar;
