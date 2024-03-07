import * as AK from '@ariakit/react';
import { tabsStaticClass } from '@marbemac/ui-styles';
import { forwardRef } from 'react';

import { useTabsInternalContext } from './internal-context.tsx';

export interface TabListProps extends AK.TabListProps {}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList({ className, ...props }, ref) {
  const { slots, classNames } = useTabsInternalContext();

  const listTw = slots.list({ class: [tabsStaticClass('list'), className, classNames?.list] });

  return <AK.TabList ref={ref} {...props} className={listTw} />;
});
