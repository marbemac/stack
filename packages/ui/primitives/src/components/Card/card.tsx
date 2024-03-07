import {
  type CardSlotProps,
  cardStaticClass,
  cardStyle,
  type CardStyleProps,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { forwardRef, useMemo } from 'react';

import { createElement, type Options, type Props } from '../../utils/composition.tsx';

export interface CardOptions extends Options, CardStyleProps, CardSlotProps {}

export type CardProps<T extends React.ElementType = 'h1'> = Props<T, CardOptions>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(originalProps, ref) {
  const [{ className, classNames, children, ...props }, variantProps] = splitPropsVariants(
    originalProps,
    cardStyle.variantKeys,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => cardStyle(variantProps), Object.values(variantProps));

  const baseTw = slots.base({ class: [cardStaticClass('base'), className] });
  const innerTw = slots.inner({ class: [cardStaticClass('inner'), classNames?.inner] });

  return createElement('div', {
    ...props,
    ref,
    className: baseTw,
    children: <div className={innerTw}>{children}</div>,
  });
});
