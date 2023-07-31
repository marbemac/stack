/**
 * Original credit to solidjs -> https://github.com/solidjs/solid/blob/23f3c7a2f636e586e44f576c2b2a8c76822a5d4f/packages/solid/src/server/rendering.ts#L161
 */

export function splitProps<T extends object, K1 extends keyof T>(props: T, ...keys: [K1[]]): [Pick<T, K1>, Omit<T, K1>];
export function splitProps<T extends object, K1 extends keyof T, K2 extends keyof T>(
  props: T,
  ...keys: [K1[], K2[]]
): [Pick<T, K1>, Pick<T, K2>, Omit<T, K1 | K2>];
export function splitProps<T extends object, K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(
  props: T,
  ...keys: [K1[], K2[], K3[]]
): [Pick<T, K1>, Pick<T, K2>, Pick<T, K3>, Omit<T, K1 | K2 | K3>];
export function splitProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
  K3 extends keyof T,
  K4 extends keyof T,
>(
  props: T,
  ...keys: [K1[], K2[], K3[], K4[]]
): [Pick<T, K1>, Pick<T, K2>, Pick<T, K3>, Pick<T, K4>, Omit<T, K1 | K2 | K3 | K4>];
export function splitProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
  K3 extends keyof T,
  K4 extends keyof T,
  K5 extends keyof T,
>(
  props: T,
  ...keys: [K1[], K2[], K3[], K4[], K5[]]
): [Pick<T, K1>, Pick<T, K2>, Pick<T, K3>, Pick<T, K4>, Pick<T, K5>, Omit<T, K1 | K2 | K3 | K4 | K5>];
export function splitProps<T>(props: T, ...keys: [(keyof T)[]]) {
  const descriptors = Object.getOwnPropertyDescriptors(props);
  const split = (k: (keyof T)[]) => {
    const clone: Partial<T> = {};
    for (let i = 0; i < k.length; i++) {
      const key = k[i];
      // @ts-expect-error ignore
      if (descriptors[key]) {
        // @ts-expect-error ignore
        Object.defineProperty(clone, key, descriptors[key]);
        // @ts-expect-error ignore
        delete descriptors[key];
      }
    }
    return clone;
  };

  return keys.map(split).concat(split(Object.keys(descriptors) as (keyof T)[]));
}
