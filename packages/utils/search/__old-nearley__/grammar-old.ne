@{%

const moo = require('moo')

const qualVal = { match: /[a-zA-Z0-9@_\-\\.]+/, value: (s) => s.trimStart() };
const qualValWithSpace = { match: /[a-zA-Z0-9@_\s\\.]+/, value: (s) => s.trimStart(), lineBreaks: true };

const QUAL_OPS = ['>', '<', '>=', '<='];
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
  },

  qualifier: {
    quote: { match: '"', next: 'literalQualifier' },
    lbracket: { match: '[', next: 'multiValQualifier' },
    qualOp: { ...qualOp },
    qualVal: { ...qualVal, pop: 1 },
  },

  literalQualifier: {
    qualOp: { ...qualOp },
    qualVal: { ...qualValWithSpace, lineBreaks: true },
    quote: { match: '"', pop: 1 },
  },

  multiValQualifier: {
    qualOp: { ...qualOp },
    qualVal: { ...qualValWithSpace, lineBreaks: true },
    comma: ',',
    rbracket: { match: ']', pop: 1 },
  },
};

const createLexer = () => {
  return moo.states(STATES);
};

const lexer = createLexer();

%}

# https://omrelli.ug/nearley-playground/ is helpful to experiment
# Required adjustments to the content of this file if copy pasting over to playground:
#   - need to remove "@preprocessor typescript" statement
#   - need to copy createLexer function from lexer.ts, and change add "const moo = require('moo')" (es6 imports not supported)

@lexer lexer

Main -> (Qual | _ | Raw):*  {% transformMain %}

Qual ->
	QualKey QualVal:? {% ([key,val]) => ({ key, op: '=', val: val || '' }) %}
	| QualKey QualOp QualVal:? {% ([key,op,val]) => ({ key, op: op.value, val: val || '' }) %}
	| QualKey Quote QualVal:? Quote:? {% ([key,,val]) => ({ key, op: '=', val: val || '' }) %}
	| QualKey LBracket QualMultiVal:? RBracket:? {% ([key,,val]) => ({ key, op: '=', val: val || '' }) %}

QualKey -> %qualKey {% id %}

QualOp -> %qualOp {% id %}

QualVal -> %qualVal {% id %}

QualMultiVal -> (QualVal Comma:?):+ {% ([val]) => val.map((v) => v[0]) %}

Quote -> %quote {% () => null %}

LBracket -> %lbracket {% () => null %}

RBracket -> %rbracket {% () => null %}

Comma -> %comma {% () => null %}

Raw -> %string {% id %}

_ -> %space {% () => null %}

@{%

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

%}
