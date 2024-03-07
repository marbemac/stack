import type { SelectSlotProps, selectStyle, SelectStyleProps } from '@marbemac/ui-styles';

import { createContext } from '../../utils/context.tsx';
import type { ButtonProps } from '../Button/button.tsx';

export const [SelectInternalContext, useSelectInternalContext] = createContext<{
  slots: ReturnType<typeof selectStyle>;
  classNames: SelectSlotProps['classNames'];
  variant?: ButtonProps['variant'];
  size?: SelectStyleProps['size'];
}>({
  name: 'SelectInternalContext',
  strict: true,
});
