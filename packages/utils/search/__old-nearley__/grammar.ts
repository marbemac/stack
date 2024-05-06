/* eslint-disable */
// @ts-nocheck
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var negation: any;
declare var qualKey: any;
declare var qualOp: any;
declare var qualVal: any;
declare var quote: any;
declare var lbracket: any;
declare var rbracket: any;
declare var comma: any;
declare var string: any;
declare var space: any;


import { createLexer } from './lexer.js';

const lexer = createLexer();




function transformMain([tokens]) {
	const noFalsey = [];
	for (const f of tokens) {
		if (f[0]) {
			noFalsey.push(f[0])
		}
	}

  return {
		tokens: noFalsey
	};
}


interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "Main$ebnf$1", "symbols": []},
    {"name": "Main$ebnf$1$subexpression$1", "symbols": ["Filter"]},
    {"name": "Main$ebnf$1$subexpression$1", "symbols": ["_"]},
    {"name": "Main$ebnf$1$subexpression$1", "symbols": ["Raw"]},
    {"name": "Main$ebnf$1", "symbols": ["Main$ebnf$1", "Main$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Main", "symbols": ["Main$ebnf$1"], "postprocess": transformMain},
    {"name": "Filter", "symbols": ["TextFilter"], "postprocess": id},
    {"name": "Filter", "symbols": ["QuotedTextFilter"], "postprocess": id},
    {"name": "Filter", "symbols": ["TextFilterIn"], "postprocess": id},
    {"name": "TextFilter$ebnf$1", "symbols": [(lexer.has("negation") ? {type: "negation"} : negation)], "postprocess": id},
    {"name": "TextFilter$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "TextFilter$ebnf$2", "symbols": [(lexer.has("qualOp") ? {type: "qualOp"} : qualOp)], "postprocess": id},
    {"name": "TextFilter$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "TextFilter$ebnf$3", "symbols": [(lexer.has("qualVal") ? {type: "qualVal"} : qualVal)], "postprocess": id},
    {"name": "TextFilter$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "TextFilter", "symbols": ["TextFilter$ebnf$1", (lexer.has("qualKey") ? {type: "qualKey"} : qualKey), "TextFilter$ebnf$2", "TextFilter$ebnf$3"], "postprocess": ([negated,key,op,val]) => ({ negated: Boolean(negated), key, op: op || '=', val: val || '' })},
    {"name": "QuotedTextFilter$ebnf$1", "symbols": [(lexer.has("negation") ? {type: "negation"} : negation)], "postprocess": id},
    {"name": "QuotedTextFilter$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "QuotedTextFilter$ebnf$2", "symbols": [(lexer.has("qualVal") ? {type: "qualVal"} : qualVal)], "postprocess": id},
    {"name": "QuotedTextFilter$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "QuotedTextFilter$ebnf$3", "symbols": [(lexer.has("quote") ? {type: "quote"} : quote)], "postprocess": id},
    {"name": "QuotedTextFilter$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "QuotedTextFilter", "symbols": ["QuotedTextFilter$ebnf$1", (lexer.has("qualKey") ? {type: "qualKey"} : qualKey), (lexer.has("quote") ? {type: "quote"} : quote), "QuotedTextFilter$ebnf$2", "QuotedTextFilter$ebnf$3"], "postprocess": ([negated,key,,val]) => ({ negated: Boolean(negated), key, op: '=', val: val || '' })},
    {"name": "TextFilterIn$ebnf$1", "symbols": [(lexer.has("negation") ? {type: "negation"} : negation)], "postprocess": id},
    {"name": "TextFilterIn$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "TextFilterIn$ebnf$2", "symbols": ["QualMultiVal"], "postprocess": id},
    {"name": "TextFilterIn$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "TextFilterIn$ebnf$3", "symbols": [(lexer.has("rbracket") ? {type: "rbracket"} : rbracket)], "postprocess": id},
    {"name": "TextFilterIn$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "TextFilterIn", "symbols": ["TextFilterIn$ebnf$1", (lexer.has("qualKey") ? {type: "qualKey"} : qualKey), (lexer.has("lbracket") ? {type: "lbracket"} : lbracket), "TextFilterIn$ebnf$2", "TextFilterIn$ebnf$3"], "postprocess": ([negated, key,,val]) => ({ negated: Boolean(negated), key, op: '=', val: val || '' })},
    {"name": "QualMultiVal$ebnf$1$subexpression$1$ebnf$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": id},
    {"name": "QualMultiVal$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "QualMultiVal$ebnf$1$subexpression$1", "symbols": [(lexer.has("qualVal") ? {type: "qualVal"} : qualVal), "QualMultiVal$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "QualMultiVal$ebnf$1", "symbols": ["QualMultiVal$ebnf$1$subexpression$1"]},
    {"name": "QualMultiVal$ebnf$1$subexpression$2$ebnf$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": id},
    {"name": "QualMultiVal$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "QualMultiVal$ebnf$1$subexpression$2", "symbols": [(lexer.has("qualVal") ? {type: "qualVal"} : qualVal), "QualMultiVal$ebnf$1$subexpression$2$ebnf$1"]},
    {"name": "QualMultiVal$ebnf$1", "symbols": ["QualMultiVal$ebnf$1", "QualMultiVal$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "QualMultiVal", "symbols": ["QualMultiVal$ebnf$1"], "postprocess": ([val]) => val.map((v) => v[0])},
    {"name": "Raw", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": () => null}
  ],
  ParserStart: "Main",
};

export default grammar;
