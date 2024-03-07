import type { StyleToken, TokenCssVars, TokenFactory, TokenToCssVarFn } from './types.ts';

export const createCssVariableFactory = (prefix: string): TokenToCssVarFn => {
  return name => `--${prefix}-${name}`;
};

export type TokenProcessor = ReturnType<typeof createTokenProcessor>;

export const createTokenProcessor = (t: TokenToCssVarFn) => {
  return <T extends StyleToken>(tokenFactory: TokenFactory<T>) => {
    const tokenValues = tokenFactory(t);

    // css variables
    const variables: Record<string, string> = {};

    // @ts-expect-error ignore
    const tokensCssVars: TokenCssVars = {};

    for (const name in tokenValues) {
      const val = tokenValues[name];
      if (val === undefined) continue;

      const cssVar = t(name as StyleToken);

      tokensCssVars[name] = cssVar;
      variables[cssVar] = String(val);
    }

    return { tokensCssVars, tokenValues, variables };
  };
};
