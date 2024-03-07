import { keyboardStaticClass, keyboardStyle, splitPropsVariants } from '@marbemac/ui-styles';
import { forwardRef, useMemo } from 'react';

import { createElement, type Options, type Props } from '../../utils/composition.tsx';
import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';

export interface KeyboardOptions extends Options {}

export type KeyboardProps<T extends React.ElementType = 'kbd'> = Props<T, KeyboardOptions>;

export const [KeyboardContext, useKeyboardContext] = createContext<ContextValue<KeyboardProps, HTMLElement>>({
  name: 'KeyboardContext',
  strict: false,
});

export const Keyboard = forwardRef<HTMLElement, KeyboardProps>(function Keyboard(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, KeyboardContext);

  const [{ className, ...props }, variantProps] = splitPropsVariants(originalProps, keyboardStyle.variantKeys);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => keyboardStyle(variantProps), Object.values(variantProps));

  const baseTw = slots.base({ class: [keyboardStaticClass('base'), className] });

  return createElement('kbd', { ...props, dir: 'ltr', ref, className: baseTw });
});
