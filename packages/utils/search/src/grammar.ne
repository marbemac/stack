@preprocessor typescript

@{%

import { createLexer } from './lexer.js';

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
