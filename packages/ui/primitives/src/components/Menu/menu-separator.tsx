import * as AK from '@ariakit/react';
import { menuStaticClass } from '@marbemac/ui-styles';
import { forwardRef } from 'react';

import { useMenuInternalContext, useMenuSearchContext } from './internal-context.tsx';

export interface MenuSeparatorProps extends AK.MenuSeparatorProps {}

export const MenuSeparator = forwardRef<HTMLHRElement, MenuSeparatorProps>(function MenuSeparator(
  { className, ...props },
  ref,
) {
  const { value: searchValue } = useMenuSearchContext() || {};
  const { slots, classNames } = useMenuInternalContext();

  if (searchValue) return null;

  const baseTw = slots.separator({ class: [menuStaticClass('separator'), className, classNames?.separator] });

  return <AK.MenuSeparator ref={ref} {...props} className={baseTw} />;
});
