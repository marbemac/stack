import { tabsStaticClass } from '@marbemac/ui-styles';
import { forwardRef } from 'react';

import type { Options, Props } from '../../utils/composition.tsx';
import { useTabsInternalContext } from './internal-context.tsx';

export interface TabPanelsOptions extends Options {}

export type TabPanelsProps<T extends React.ElementType = 'div'> = Props<T, TabPanelsOptions>;

export const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>(function TabPanels({ className, ...props }, ref) {
  const { slots, classNames } = useTabsInternalContext();

  const panelsTw = slots.panels({ class: [tabsStaticClass('panels'), className, classNames?.panels] });

  return <div ref={ref} {...props} className={panelsTw} />;
});
