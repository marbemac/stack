import * as AK from '@ariakit/react';
import { tabsStaticClass } from '@marbemac/ui-styles';
import { forwardRef, useId } from 'react';

import { usePrevious } from '../../hooks/use-previous.ts';
import { useTabsInternalContext } from './internal-context.tsx';

export interface TabPanelProps extends AK.TabPanelProps {}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel({ className, ...props }, ref) {
  const { slots, classNames } = useTabsInternalContext();

  const panelTw = slots.panel({ class: [tabsStaticClass('panel'), className, classNames?.panel] });

  const tab = AK.useTabContext();
  if (!tab) throw new Error('TabPanel must be wrapped in a Tabs component');

  const defaultId = useId();
  const id = props.id ?? defaultId;
  const tabId = AK.useStoreState(tab, () => props.tabId ?? tab.panels.item(id)?.tabId);
  const previousTabId = usePrevious(AK.useStoreState(tab, 'selectedId'));
  const wasOpen = tabId && previousTabId === tabId;

  return (
    <AK.TabPanel ref={ref} id={id} tabId={tabId} {...props} data-was-open={wasOpen || undefined} className={panelTw} />
  );
});
