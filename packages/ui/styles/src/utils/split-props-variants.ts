/**
 * Original credit to NextUI
 * https://github.com/nextui-org/nextui/blob/feat/v2/packages/core/system/src/utils.ts#L46
 */

export const splitPropsVariants = <T extends {}, K extends keyof T>(
  props: T,
  variantKeys?: K[],
  removeVariantProps = true,
): readonly [Omit<T, K> | T, Pick<T, K>] => {
  if (!variantKeys) {
    // @ts-expect-error ignore
    return [props, {}];
  }

  const picked = variantKeys.reduce((acc, key) => {
    // Only include the key in `picked` if it exists in `props`
    if (key in props) {
      return { ...acc, [key]: props[key] };
    } else {
      return acc;
    }
  }, {});

  if (removeVariantProps) {
    const omitted = Object.keys(props)
      .filter(key => !variantKeys.includes(key as K))
      .reduce((acc, key) => ({ ...acc, [key]: props[key as keyof T] }), {});

    return [omitted, picked] as [Omit<T, K>, Pick<T, K>];
  } else {
    return [props, picked] as [T, Pick<T, K>];
  }
};
