import {
  type FunctionAstNode,
  type IsNegatableNode,
  type IsSortableNode,
  type QualifierAstNode,
  type SearchNode,
} from './visitor.ts';

export function stringifySearchAstNode(token?: SearchNode) {
  if (!token) return '';

  switch (token.type) {
    case 'search_query':
      return [
        stringifySearchAstNode(token.fromClause),
        stringifySearchAstNode(token.selectClause),
        stringifySearchAstNode(token.whereClause),
      ]
        .filter(Boolean)
        .join('\n');
    case 'from_clause':
      return `FROM ${token.table}`;
    case 'select_clause':
      return token.expr.columns.length ? `SELECT ` : '';
    case 'select_expr':
      return token.columns.length ? token.columns.map(stringifySearchAstNode).join(' ') : '';
    case 'where_clause':
      return token.expr.conditions.length ? `WHERE ` : '';
    case 'where_expr':
      return token.conditions.length ? token.conditions.map(stringifySearchAstNode).join(' ') : '';
    case 'qualifier':
      return handleNegation(token, stringifyQualifier(token));
    case 'function':
      return handleSortDir(token, handleNegation(token, stringifyFunction(token)));
    case 'function_arg':
      return token.vals.map(stringifySearchAstNode).join(' ');
    case 'qualifier_key':
      return token.value;
    case 'bracket_list':
      return `[${token.values.map(stringifySearchAstNode).join(', ')}]`;
    case 'relative_date':
      return `${token.sign}${token.value}${token.unit}`;
    case 'text':
      return handleSortDir(token, token.quoted ? `"${token.value}"` : token.value);
    case 'number':
      return token.value;
    case 'boolean':
      return token.value;
  }
}

function stringifyQualifier(token: QualifierAstNode) {
  let stringifiedToken = stringifySearchAstNode(token.lhs);

  if (token.rhs) {
    stringifiedToken += ':';
    stringifiedToken += token.op || '';
    stringifiedToken += stringifySearchAstNode(token.rhs);
  }

  return stringifiedToken;
}

function stringifyFunction(token: FunctionAstNode) {
  let stringifiedToken = `${token.name}(`;

  if (token.args) {
    stringifiedToken += token.args.map(stringifySearchAstNode).join(', ');
  }

  stringifiedToken += ')';

  if (token.rhs) {
    stringifiedToken += ':';
    stringifiedToken += token.op || '';
    stringifiedToken += stringifySearchAstNode(token.rhs);
  }

  return stringifiedToken;
}

function handleSortDir(token: IsSortableNode, stringifiedToken: string) {
  if (!token.sort) return stringifiedToken;
  return `${token.sort === 'asc' ? '+' : '-'}${stringifiedToken}`;
}

function handleNegation(token: IsNegatableNode, stringifiedToken: string) {
  return token.negated ? `!${stringifiedToken}` : stringifiedToken;
}
