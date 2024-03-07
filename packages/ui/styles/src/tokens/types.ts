import type { CSSRuleObject } from 'tailwindcss/types/config';

import type { FontToken } from './fonts.ts';
import type { RadiusToken } from './radius.ts';
import type { SpaceToken } from './space.ts';
import type { TypographyToken } from './typography.ts';

export type StyleToken = RadiusToken | SpaceToken | TypographyToken | FontToken;

type CssVar = `--${string}`;

export type TokenFn = (name: StyleToken) => string;
export type TokenToCssVarFn = (name: StyleToken) => CssVar;

export type TokenCssVars<T extends StyleToken = StyleToken> = Record<T, CssVar>;

export type TokenFactory<T extends StyleToken> = (t: TokenToCssVarFn) => Record<T, string>;

export type UtilityFactory = (t: TokenFn) => CSSRuleObject | CSSRuleObject[];
