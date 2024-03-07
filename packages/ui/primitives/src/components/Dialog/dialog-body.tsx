import { dialogStaticClass } from '@marbemac/ui-styles';
import { forwardRef } from 'react';

import { createElement, type Options, type Props } from '../../utils/composition.tsx';
import { useDialogInternalContext } from './internal-context.tsx';

export interface DialogBodyOptions extends Options {}

export type DialogBodyProps<T extends React.ElementType = 'div'> = Props<T, DialogBodyOptions>;

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(function DialogBody(props, ref) {
  const { className, ...others } = props;

  const { slots, classNames } = useDialogInternalContext();

  const baseTw = slots.body({ class: [dialogStaticClass('body'), className, classNames?.body] });

  return createElement('div', { ...others, ref, className: baseTw });
});
