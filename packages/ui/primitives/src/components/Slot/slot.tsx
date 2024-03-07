import { forwardRef } from 'react';

import { createElement, type Options, type Props } from '../../utils/composition.tsx';
import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';

export interface SlotOptions extends Options {}

export type SlotProps<T extends React.ElementType = 'div'> = Props<T, SlotOptions>;

export const [SlotContext, useSlotContext] = createContext<ContextValue<SlotProps, HTMLDivElement>>({
  name: 'SlotContext',
  strict: false,
});

export const Slot = forwardRef<HTMLDivElement, SlotProps>(function Text(props, ref) {
  [props, ref] = useContextProps(props, ref, SlotContext);

  return createElement('div', { ...props, ref });
});
