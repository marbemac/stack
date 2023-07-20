import { isFunction } from '@kobalte/utils';
import { mergeProps } from 'solid-js';

import type { ComponentsConfig } from './components-config.ts';
import { useTheme } from './theme-context.ts';

function useComponentTheme<T extends keyof ComponentsConfig>(component: T) {
  return useTheme()?.components?.[component] ?? undefined;
}

/**
 * Resolve the `slotClasses` provided in the component theme configuration.
 */
export function useThemeClasses<Slots extends string>(component: keyof ComponentsConfig, props: any) {
  const classes = useComponentTheme(component)?.slotClasses ?? {};

  return (isFunction(classes) ? classes(props) : classes) as Partial<Record<Slots, string>>;
}

/**
 * Merge default, theme and component props into a single props object.
 * @param component The name of the component to look for in the theme.
 * @param defaultProps The default props, will be overridden by theme and component props.
 * @param props The component `props` object.
 * @example
 * // mergedProps = defaultProps <== themeProps <== props
 */
export function mergeThemeProps<T extends Record<string, any>>(
  component: keyof ComponentsConfig,
  defaultProps: Partial<T>,
  props: T,
): T {
  const themeProps = () => useComponentTheme(component)?.defaultProps ?? {};

  return mergeProps(defaultProps, themeProps, props);
}
