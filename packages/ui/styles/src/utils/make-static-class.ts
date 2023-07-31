import { toKebabCase } from './kebab-case.ts';

export function makeStaticClass<T extends string>(component: string) {
  return function (slot: 'base' | T) {
    if (slot === 'base') return toKebabCase(`ui-${component}`);

    return toKebabCase(`ui-${component}-${slot}`);
  };
}
