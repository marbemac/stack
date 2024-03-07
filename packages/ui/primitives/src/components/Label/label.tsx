import type { LabelSlotProps, LabelStyleProps } from '@marbemac/ui-styles';
import { labelStaticClass, labelStyle, splitPropsVariants } from '@marbemac/ui-styles';
import { createElement, forwardRef, useMemo } from 'react';

import type { Options, Props } from '../../utils/composition.tsx';
import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';

export interface LabelOptions extends Options, LabelStyleProps, LabelSlotProps {}

export type LabelProps<T extends React.ElementType = 'div'> = Props<T, LabelOptions>;

export const [LabelContext, useLabelContext] = createContext<ContextValue<LabelProps, HTMLLabelElement>>({
  name: 'LabelContext',
  strict: false,
});

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, LabelContext);

  const [{ className, ...props }, variantProps] = splitPropsVariants(originalProps, labelStyle.variantKeys);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => labelStyle(variantProps), Object.values(variantProps));

  const baseTw = slots.base({ class: [labelStaticClass('base'), className] });

  return createElement('div', { ...props, ref, className: baseTw });
});
