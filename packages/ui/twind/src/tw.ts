import type { StylePropsResolver } from '@marbemac/ui-styles';
import type { TxFunction } from '@twind/core';

import { cx } from './twind.ts';

export const createStylePropsResolver =
  ({ tx }: { tx: TxFunction }): StylePropsResolver =>
  ({ tw, UNSAFE_class }) => {
    if (!tw && !UNSAFE_class) {
      return;
    }

    const className = cx(UNSAFE_class, tx(tw));

    return className;
  };
