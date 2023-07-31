import type { StackProps as BStackProps, StackSlots } from '@marbemac/ui-styles';
import { splitPropsVariants, stackStaticClass, stackStyle } from '@marbemac/ui-styles';
import React, { useMemo } from 'react';

import { useStyleProps } from '../../provider.tsx';
import { polyRef } from '../../utils/forward-ref.ts';
import { Box } from '../Box/index.ts';
import { useMergeThemeProps, useThemeClasses } from '../Themed/utils.ts';

export type StackProps = BStackProps<React.ReactNode> & {
  children: React.ReactNode;
};

/**
 * `Stack` makes it easy to stack elements together and apply a space between them.
 */
export const Stack = polyRef<'div', StackProps>((props, ref) => {
  props = useMergeThemeProps('Stack', stackStyle.defaultVariants, props);

  const [local, variantProps] = splitPropsVariants(props, stackStyle.variantKeys);

  const { as: As = 'div', children, UNSAFE_class, slotClasses, divider, tw, ...others } = local;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => stackStyle(variantProps), [...Object.values(variantProps)]);

  const themeClasses = useThemeClasses<StackSlots>('Stack', props);
  const baseClass = slots.base({ class: [themeClasses.base, slotClasses?.base] });
  const dividerClass = slots.divider({ class: [themeClasses.divider, slotClasses?.divider] });

  const rootClass = useStyleProps({ tw: [baseClass, tw], UNSAFE_class: [stackStaticClass('base'), UNSAFE_class] });

  let clones = children;
  const hasDivider = !!divider;
  const childrenWithoutNulls = React.Children.toArray(children).filter(Boolean);
  if (childrenWithoutNulls && hasDivider) {
    const childCount = childrenWithoutNulls.length;
    clones = React.Children.map(childrenWithoutNulls, (child, index) => {
      const isLast = index + 1 === childCount;

      const clonedDivider =
        typeof divider === 'boolean' ? (
          <Box key="d" tw={dividerClass} />
        ) : (
          React.cloneElement(divider as any, { key: 'd' })
        );

      const _divider = isLast ? null : clonedDivider;

      return <React.Fragment key={index}>{[child, _divider]}</React.Fragment>;
    });
  }

  return (
    <As {...others} ref={ref} className={rootClass}>
      {clones}
    </As>
  );
});

export type FixedDirectionStackProps = Omit<StackProps, 'dir'>;

/**
 * `HStack` arranges its children in a horizontal line.
 */
export const HStack = polyRef<'div', FixedDirectionStackProps>((props, ref) => {
  return <Stack {...props} ref={ref} dir="horizontal" />;
});

/**
 * `VStack` arranges its children in a vertical line.
 */
export const VStack = polyRef<'div', FixedDirectionStackProps>((props, ref) => {
  return <Stack {...props} ref={ref} dir="vertical" />;
});
