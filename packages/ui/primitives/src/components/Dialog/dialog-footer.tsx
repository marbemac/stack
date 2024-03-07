import { dialogStaticClass } from '@marbemac/ui-styles';
import { forwardRef } from 'react';

import { createElement, type Options, type Props } from '../../utils/composition.tsx';
import { useDialogInternalContext } from './internal-context.tsx';

export interface DialogFooterOptions extends Options {}

export type DialogFooterProps<T extends React.ElementType = 'div'> = Props<T, DialogFooterOptions>;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter(props, ref) {
  const { className, ...others } = props;

  const { slots, classNames } = useDialogInternalContext();

  const baseTw = slots.footer({ class: [dialogStaticClass('footer'), className, classNames?.footer] });

  return createElement('div', { ...others, ref, className: baseTw });
});
