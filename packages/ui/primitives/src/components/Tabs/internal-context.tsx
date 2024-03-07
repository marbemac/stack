import type { TabsSlotProps, tabsStyle } from '@marbemac/ui-styles';

import { createContext } from '../../utils/context.tsx';

export const [TabsInternalContext, useTabsInternalContext] = createContext<{
  slots: ReturnType<typeof tabsStyle>;
  classNames: TabsSlotProps['classNames'];
}>({
  name: 'TabsInternalContext',
  strict: true,
});
