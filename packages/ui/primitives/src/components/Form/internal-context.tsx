import type { FormSlotProps, formStyle } from '@marbemac/ui-styles';

import { createContext } from '../../utils/context.tsx';

export const [FormInternalContext, useFormInternalContext] = createContext<{
  disabled?: boolean;
  readOnly?: boolean;
  slots: ReturnType<typeof formStyle>;
  classNames: FormSlotProps['classNames'];
}>({
  name: 'FormInternalContext',
  strict: true,
});
