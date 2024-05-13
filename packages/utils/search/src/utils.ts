import { type AnySearchToken, type FunctionAstNode, type QualifierAstNode, SearchToken } from './visitor.ts';

function stringifyQualifier(token: QualifierAstNode) {
  let stringifiedToken = '';

  if (token.negated) {
    stringifiedToken += '!';
  }

  stringifiedToken += stringifySearchToken(token.lhs);

  if (token.rhs) {
    stringifiedToken += ':';
    stringifiedToken += token.op || '';
    stringifiedToken += stringifySearchToken(token.rhs);
  }

  return stringifiedToken;
}

function stringifyFunction(token: FunctionAstNode) {
  let stringifiedToken = '';

  if (token.negated) {
    stringifiedToken += '!';
  }

  stringifiedToken += `${token.name}(`;

  if (token.args) {
    stringifiedToken += token.args.map(stringifySearchToken).join(', ');
  }

  stringifiedToken += ')';

  if (token.rhs) {
    stringifiedToken += ':';
    stringifiedToken += token.op || '';
    stringifiedToken += stringifySearchToken(token.rhs);
  }

  return stringifiedToken;
}

export function stringifySearchToken(token?: AnySearchToken) {
  if (!token) return '';

  switch (token.type) {
    case SearchToken.SearchQuery:
      return [
        stringifySearchToken(token.fromClause),
        stringifySearchToken(token.selectClause),
        stringifySearchToken(token.whereClause),
      ]
        .filter(Boolean)
        .join('\n');
    case SearchToken.FromClause:
      return `FROM ${token.table}`;
    case SearchToken.SelectClause:
      return token.columns.length ? `SELECT ${token.columns.map(stringifySearchToken).join(' ')}` : '';
    case SearchToken.WhereClause:
      return token.conditions.length ? `WHERE ${token.conditions.map(stringifySearchToken).join(' ')}` : '';
    case SearchToken.Qualifier:
      return stringifyQualifier(token);
    case SearchToken.Function:
      return stringifyFunction(token);
    case SearchToken.FunctionArg:
      return token.vals.map(stringifySearchToken).join(' ');
    case SearchToken.QualifierKey:
      return token.value;
    case SearchToken.QualifierIn:
      return `[${token.values.map(stringifySearchToken).join(', ')}]`;
    case SearchToken.RelativeDateVal:
      return `${token.sign}${token.value}${token.unit}`;
    case SearchToken.TextVal:
      return token.quoted ? `"${token.value}"` : token.value;
    case SearchToken.NumberVal:
      return token.value;
    case SearchToken.BooleanVal:
      return token.value;
  }
}
