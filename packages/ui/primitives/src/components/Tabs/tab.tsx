import * as AK from '@ariakit/react';
import { tabsStaticClass } from '@marbemac/ui-styles';
import { forwardRef } from 'react';

import { useTabsInternalContext } from './internal-context.tsx';

export interface TabProps extends AK.TabProps {}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab({ className, children, ...props }, ref) {
  const { slots, classNames } = useTabsInternalContext();

  const tabTw = slots.tab({ class: [tabsStaticClass('tab'), className, classNames?.tab] });
  const tabInnerTw = slots.tabInner({ class: [tabsStaticClass('tabInner'), classNames?.tabInner] });
  const tabInnerHiddenTw = slots.tabInnerHidden({
    class: [tabsStaticClass('tabInnerHidden'), classNames?.tabInnerHidden],
  });

  return (
    <AK.Tab ref={ref} {...props} className={tabTw}>
      <span className={tabInnerTw}>{children}</span>
      <span className={tabInnerHiddenTw}>{children}</span>
    </AK.Tab>
  );
});
