import { createContext, useContext } from 'solid-js';

import type { ThemeContextVal } from './types.ts';

export const ThemeContext = createContext<ThemeContextVal>();

/**
 * Primitive that reads from `ThemeProvider` context,
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('`useTheme` must be used within a `ThemeProvider`');
  }

  return context;
}

/**
 * Change value based on color mode.
 *
 * @param light the light mode value
 * @param dark the dark mode value
 * @return A memoized value based on the color mode.
 *
 * @example
 *
 * ```js
 * const Icon = useColorModeValue(MoonIcon, SunIcon)
 * ```
 */
// export function useColorModeValue<TLight = unknown, TDark = unknown>(light: TLight, dark: TDark) {
//   const { colorMode } = useColorMode();

//   return createMemo(() => (colorMode() === "dark" ? dark : light));
// }
