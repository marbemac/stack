import type { ILexingResult, IRecognitionException, Lexer } from 'chevrotain';

import { SearchLexer } from './grammar/lexer.ts';
import { SearchParser } from './grammar/parser.ts';
import type { SearchString } from './types.ts';

let lexerSingleton: Lexer;
let parserSingleton: SearchParser;

export interface ParseQueryOpts<T extends InputType> {
  input: SearchString;
  inputType: T;
  lexer?: Lexer;
  parser?: SearchParser;
}

type InputType = 'searchQuery' | 'selectClause' | 'selectExpression' | 'fromClause' | 'whereClause' | 'whereExpression';

export const parseSearch = <T extends InputType>({
  input,
  inputType,
  ...rest
}: ParseQueryOpts<T>): {
  cst: ReturnType<SearchParser[T]>;
  errors: IRecognitionException[];
  lexResult: ILexingResult;
} => {
  let lexer = rest.lexer || lexerSingleton;
  if (!lexer) {
    lexer = lexerSingleton = new SearchLexer();
  }

  const lexResult = lexer.tokenize(input);

  let parser = rest.parser || parserSingleton;
  if (!parser) {
    parser = parserSingleton = new SearchParser();
  }

  // "input" is a setter which will reset the parser's state.
  parser.input = lexResult.tokens;

  const cst = parser[inputType]() as ReturnType<SearchParser[T]>;

  return { cst, errors: parser.errors, lexResult };
};
