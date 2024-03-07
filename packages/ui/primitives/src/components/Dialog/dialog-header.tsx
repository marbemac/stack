import { dialogStaticClass } from '@marbemac/ui-styles';
import { forwardRef } from 'react';

import { createElement, type Options, type Props } from '../../utils/composition.tsx';
import { useDialogInternalContext } from './internal-context.tsx';

export interface DialogHeaderOptions extends Options {}

export type DialogHeaderProps<T extends React.ElementType = 'div'> = Props<T, DialogHeaderOptions>;

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(props, ref) {
  const { className, ...others } = props;

  const { slots, classNames } = useDialogInternalContext();

  const baseTw = slots.header({ class: [dialogStaticClass('header'), className, classNames?.header] });

  return createElement('div', { ...others, ref, className: baseTw });
});
