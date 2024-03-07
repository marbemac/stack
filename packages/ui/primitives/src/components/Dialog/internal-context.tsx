import type { DialogSlotProps, dialogStyle } from '@marbemac/ui-styles';

import { createContext } from '../../utils/context.tsx';

export const [DialogInternalContext, useDialogInternalContext] = createContext<{
  slots: ReturnType<typeof dialogStyle>;
  classNames: DialogSlotProps['classNames'];
}>({
  name: 'DialogInternalContext',
  strict: true,
});
