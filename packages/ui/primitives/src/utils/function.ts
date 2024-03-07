export type ChildrenWithRenderProps<P> = React.ReactNode | ((props: P) => React.ReactNode);

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function runIfFn<T, U>(valueOrFn: T | ((...fnArgs: U[]) => T), ...args: U[]): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}

export function once(fn?: Function | null) {
  let result: any;

  return function func(this: any, ...args: any[]) {
    if (fn) {
      result = fn.apply(this, args);
      // eslint-disable-next-line no-param-reassign
      fn = null;
    }

    return result;
  };
}

export const noop = () => {
  // noop
};
