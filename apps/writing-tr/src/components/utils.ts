import { Children, forwardRef as baseForwardRef, isValidElement } from 'react';

import type { As, ComponentWithAs, PropsOf, RightJoinProps } from './types';

// // https://fettblog.eu/typescript-react-generic-forward-refs
// declare module 'react' {
//   // function forwardRef<T, P = object>(
//   //   render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
//   // ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
// }

export function forwardRef<Component extends As, Props extends object>(
  component: React.ForwardRefRenderFunction<
    any,
    RightJoinProps<PropsOf<Component>, Props> & {
      as?: As;
    }
  >,
) {
  return baseForwardRef(component) as unknown as ComponentWithAs<Component, Props>;
}

export const toIterator = (obj: any) => {
  return {
    ...obj,
    [Symbol.iterator]: function () {
      const keys = Object.keys(this);
      let index = 0;

      return {
        next: () => {
          if (index >= keys.length) {
            return { done: true };
          }
          const key = keys[index] || '';
          const value = this[key];

          index++;

          return { value: { key, value }, done: false };
        },
      };
    },
  };
};

export const mapPropsVariants = <T extends Record<string, any>, K extends keyof T>(
  props: T,
  variantKeys?: K[],
): readonly [Omit<T, K>, Pick<T, K>] => {
  if (!variantKeys) {
    return [props, {} as Pick<T, K>];
  }

  const omitted = Object.keys(props)
    .filter(key => !variantKeys.includes(key as K))
    .reduce((acc, key) => ({ ...acc, [key]: props[key as keyof T] }), {});

  const picked = variantKeys.reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

  return [omitted, picked] as [Omit<T, K>, Pick<T, K>];
};

/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
export const getValidChildren = (children: React.ReactNode) => {
  return Children.toArray(children).filter(child => isValidElement(child)) as React.ReactElement[];
};
