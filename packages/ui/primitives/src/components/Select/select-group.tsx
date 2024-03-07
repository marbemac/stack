import * as AK from '@ariakit/react';
import { selectStaticClass } from '@marbemac/ui-styles';
import { forwardRef } from 'react';

import { useSelectInternalContext } from './internal-context.tsx';

export interface SelectGroupProps extends AK.SelectGroupProps {}

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { className, title, ...props },
  ref,
) {
  const { slots, classNames } = useSelectInternalContext();

  const baseTw = slots.group({ class: [selectStaticClass('group'), className, classNames?.group] });
  const titleTw = slots.groupTitle({
    class: [selectStaticClass('groupTitle'), classNames?.groupTitle],
  });

  return (
    <AK.SelectGroup ref={ref} className={baseTw} {...props}>
      {title && <AK.SelectGroupLabel className={titleTw}>{title}</AK.SelectGroupLabel>}

      {props.children}
    </AK.SelectGroup>
  );
});
