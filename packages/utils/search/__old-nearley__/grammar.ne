@preprocessor typescript

@{%

import { createLexer } from './lexer.js';

const lexer = createLexer();

%}

# https://omrelli.ug/nearley-playground/ is helpful to experiment
# Required adjustments to the content of this file if copy pasting over to playground:
#   - remove "@preprocessor typescript" statement on line ~1
#   - paste contents of `lexer.ts` over the `import ... ./lexer.js` statement on line ~5
#   - remove all typescript typings from the copied code (easiest is to copy into JS file to highlight and delete)
#   - change `import moo from 'moo';` to `const moo = require('moo')` (es6 imports not supported)

@lexer lexer

Main -> (Filter | _ | Raw):*  {% transformMain %}

Filter ->
	TextFilter {% id %}
	| QuotedTextFilter {% id %}
	| TextFilterIn {% id %}

TextFilter -> %negation:? %qualKey %qualOp:? %qualVal:? {% ([negated,key,op,val]) => ({ negated: Boolean(negated), key, op: op || '=', val: val || '' }) %}

QuotedTextFilter -> %negation:? %qualKey %quote %qualVal:? %quote:? {% ([negated,key,,val]) => ({ negated: Boolean(negated), key, op: '=', val: val || '' }) %}

TextFilterIn -> %negation:? %qualKey %lbracket QualMultiVal:? %rbracket:? {% ([negated, key,,val]) => ({ negated: Boolean(negated), key, op: '=', val: val || '' }) %}

QualMultiVal -> (%qualVal %comma:?):+ {% ([val]) => val.map((v) => v[0]) %}

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
