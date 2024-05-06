/*!
 * Portions of this file are based on code from Sentry.
 * FSL-1.1-Apache-2.0 Licensed, Copyright (c) Functional Software, Inc. dba Sentry.
 *
 * Credits to the Sentry team:
 * https://github.com/getsentry/sentry/blob/4bffd8a9615296c134447e322769be8b068137c0/static/app/utils/discover/fields.tsx
 */

export interface ParsedFunction {
  arguments: string[];
  name: string;
}

const AGGREGATE_PATTERN = /^(\w+)\((.*)?\)$/;
// Identical to AGGREGATE_PATTERN, but without the $ for newline, or ^ for start of line
const AGGREGATE_BASE = /(\w+)\((.*)?\)/g;

export function getAggregateArg(field: string): string | null {
  // only returns the first argument if field is an aggregate
  const result = parseFunction(field);

  if (result && result.arguments.length > 0) {
    return result.arguments[0]!;
  }

  return null;
}

export function parseFunction(field: string): ParsedFunction | null {
  const results = field.match(AGGREGATE_PATTERN);
  if (results && results.length === 3) {
    return {
      name: results[1]!,
      arguments: parseArguments(results[1]!, results[2]!),
    };
  }

  return null;
}

export function parseArguments(functionText: string, columnText: string): string[] {
  // Some functions take a quoted string for their arguments that may contain commas
  // This function attempts to be identical with the similarly named parse_arguments
  // found in src/sentry/search/events/fields.py
  if (
    (functionText !== 'to_other' && functionText !== 'count_if' && functionText !== 'spans_histogram') ||
    columnText?.length === 0
  ) {
    return columnText ? columnText.split(',').map(result => result.trim()) : [];
  }

  const args: string[] = [];

  let quoted = false;
  let escaped = false;

  let i = 0;
  let j = 0;

  while (j < columnText?.length) {
    if (i === j && columnText[j] === '"') {
      // when we see a quote at the beginning of
      // an argument, then this is a quoted string
      quoted = true;
    } else if (i === j && columnText[j] === ' ') {
      // argument has leading spaces, skip over them
      i += 1;
    } else if (quoted && !escaped && columnText[j] === '\\') {
      // when we see a slash inside a quoted string,
      // the next character is an escape character
      escaped = true;
    } else if (quoted && !escaped && columnText[j] === '"') {
      // when we see a non-escaped quote while inside
      // of a quoted string, we should end it
      quoted = false;
    } else if (quoted && escaped) {
      // when we are inside a quoted string and have
      // begun an escape character, we should end it
      escaped = false;
    } else if (quoted && columnText[j] === ',') {
      // when we are inside a quoted string and see
      // a comma, it should not be considered an
      // argument separator
    } else if (columnText[j] === ',') {
      // when we see a comma outside of a quoted string
      // it is an argument separator
      args.push(columnText.substring(i, j).trim());
      i = j + 1;
    }
    j += 1;
  }

  if (i !== j) {
    // add in the last argument if any
    args.push(columnText.substring(i).trim());
  }

  return args;
}

/**
 * Get the alias that the API results will have for a given aggregate function name
 */
export function getAggregateAlias(field: string): string {
  const result = parseFunction(field);

  if (!result) {
    return field;
  }

  let alias = result.name;

  if (result.arguments.length > 0) {
    alias += '_' + result.arguments.join('_');
  }

  return alias.replace(/[^\w]/g, '_').replace(/^_+/g, '').replace(/_+$/, '');
}

/**
 * Check if a field name looks like an aggregate function or known aggregate alias.
 */
export function isAggregateField(field: string): boolean {
  return parseFunction(field) !== null;
}

export function isAggregateFieldOrEquation(field: string): boolean {
  return isAggregateField(field) || isAggregateEquation(field);
}

export const EQUATION_PREFIX = 'equation|';
// const EQUATION_ALIAS_PATTERN = /^equation\[(\d+)\]$/;
export const CALCULATED_FIELD_PREFIX = 'calculated|';

export function isEquation(field: string): boolean {
  return field.startsWith(EQUATION_PREFIX);
}

export function isAggregateEquation(field: string): boolean {
  const results = field.match(AGGREGATE_BASE);

  return isEquation(field) && results !== null && results.length > 0;
}
