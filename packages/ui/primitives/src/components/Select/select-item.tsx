import * as AK from '@ariakit/react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { selectStaticClass, tx } from '@marbemac/ui-styles';
import type { SetRequired } from '@marbemac/utils-types';
import { forwardRef } from 'react';

import { Icon } from '../Icon/icon.tsx';
import { useSelectInternalContext } from './internal-context.tsx';

export interface SelectItemProps extends SetRequired<AK.SelectItemProps, 'value'> {}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, ...props },
  ref,
) {
  const select = AK.useSelectContext()!;
  const selectValue = select.useState('value');
  const checked = Array.isArray(selectValue) ? selectValue.includes(props.value) : selectValue === props.value;

  const { slots, classNames } = useSelectInternalContext();

  const baseTw = slots.item({ class: [selectStaticClass('item'), className, classNames?.item] });
  const contentTw = slots.itemContent({
    class: [selectStaticClass('itemContent'), classNames?.itemContent],
  });
  const indicatorTw = slots.itemIndicator({
    class: [selectStaticClass('itemIndicator'), classNames?.itemIndicator],
  });

  return (
    <AK.SelectItem {...props} ref={ref} className={baseTw} id={props.value}>
      <div className={indicatorTw} aria-hidden>
        <Icon icon={faCheck} className={tx(['mx-auto', !checked && 'invisible'])} fw />
      </div>

      <div className={contentTw}>{props.children ?? props.value}</div>
    </AK.SelectItem>
  );
});
