import * as AK from '@ariakit/react';
import { splitPropsVariants, type TabsSlotProps, tabsStyle, type TabsStyleProps } from '@marbemac/ui-styles';
import { useMemo } from 'react';

import { TabsInternalContext } from './internal-context.tsx';

export interface TabsProps extends Omit<AK.TabProviderProps, 'store' | 'className'>, TabsStyleProps, TabsSlotProps {}

export function Tabs(originalProps: TabsProps) {
  const [{ classNames, children, ...props }, variantProps] = splitPropsVariants(originalProps, tabsStyle.variantKeys);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => tabsStyle(variantProps), Object.values(variantProps));

  return (
    <TabsInternalContext.Provider value={{ slots, classNames }}>
      <AK.TabProvider {...props}>{children}</AK.TabProvider>
    </TabsInternalContext.Provider>
  );
}
