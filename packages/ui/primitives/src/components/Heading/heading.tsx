import {
  type HeadingSlotProps,
  headingStaticClass,
  headingStyle,
  type HeadingStyleProps,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { forwardRef, useMemo } from 'react';

import { createElement, type Options, type Props } from '../../utils/composition.tsx';
import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';

export interface HeadingOptions extends Options, HeadingStyleProps, HeadingSlotProps {}

export type HeadingProps<T extends React.ElementType = 'h1'> = Props<T, HeadingOptions>;

export const [HeadingContext, useHeadingContext] = createContext<ContextValue<HeadingProps, HTMLHeadingElement>>({
  name: 'HeadingContext',
  strict: false,
});

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, HeadingContext);

  const [{ className, ...props }, variantProps] = splitPropsVariants(originalProps, headingStyle.variantKeys);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => headingStyle(variantProps), Object.values(variantProps));

  const baseTw = slots.base({ class: [headingStaticClass('base'), className] });

  return createElement('h1', { ...props, ref, className: baseTw });
});
