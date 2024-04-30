import type { ThemeColorVariable } from '@marbemac/ui-theme';

/**
 * Type-safe access to css color variables.
 *
 * Optionaly opacityMultiplier, between 0-1, to increase transparency as needed.
 */
export const cssColorVar = (name: ThemeColorVariable, opacityMultiplier = 1) => {
  return `rgb(var(--color-${name}) / calc(var(--color-${name}-alpha, 1) * ${opacityMultiplier}))`;
};
