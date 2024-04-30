import {
  splitPropsVariants,
  type StackSlotProps,
  stackStaticClass,
  stackStyle,
  type StackStyleProps,
} from '@marbemac/ui-styles';
import React, { forwardRef, useMemo } from 'react';

import { createElement, type Options, type Props } from '../../utils/composition.tsx';
import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';

export interface StackOptions extends Options, StackStyleProps, StackSlotProps {
  divider?: boolean | React.ReactNode;
}

export type StackProps<T extends React.ElementType = 'div'> = Props<T, StackOptions>;

export const [StackContext, useStackContext] = createContext<ContextValue<StackProps, HTMLDivElement>>({
  name: 'StackContext',
  strict: false,
});

/**
 * `Stack` makes it easy to stack elements together and apply a space between them.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, StackContext);

  const [{ children, className, classNames, divider, ...props }, variantProps] = splitPropsVariants(
    originalProps,
    stackStyle.variantKeys,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => stackStyle(variantProps), Object.values(variantProps));

  const baseTw = slots.base({ class: [stackStaticClass('base'), className] });
  const dividerTw = slots.divider({ class: [stackStaticClass('divider'), classNames?.divider] });

  let clones = children;
  const hasDivider = !!divider;
  const childrenWithoutNulls = React.Children.toArray(children).filter(Boolean);
  if (childrenWithoutNulls && hasDivider) {
    const childCount = childrenWithoutNulls.length;
    clones = React.Children.map(childrenWithoutNulls, (child, index) => {
      const isLast = index + 1 === childCount;

      const clonedDivider =
        typeof divider === 'boolean' ? (
          <div key="d" className={dividerTw} />
        ) : (
          React.cloneElement(divider as any, { key: 'd' })
        );

      const _divider = isLast ? null : clonedDivider;

      return <React.Fragment key={index}>{[child, _divider]}</React.Fragment>;
    });
  }

  return createElement('div', { ...props, ref, className: baseTw, children: clones });
});

export type FixedDirectionStackProps = Omit<StackProps, 'dir'>;

/**
 * `HStack` arranges its children in a horizontal line.
 */
export const HStack = forwardRef<HTMLDivElement, FixedDirectionStackProps>(function HStack(props, ref) {
  return <Stack {...props} ref={ref} dir="horizontal" />;
});

/**
 * `VStack` arranges its children in a vertical line.
 */
export const VStack = forwardRef<HTMLDivElement, FixedDirectionStackProps>(function VStack(props, ref) {
  return <Stack {...props} ref={ref} dir="vertical" />;
});
