import type { StylePropsResolver } from '@marbemac/ui-styles';
import type { css as CSSFunction, TxFunction } from '@twind/core';

import { cx } from './twind.ts';

export const createStylePropsResolver =
  ({ tx, css: cssFn }: { tx: TxFunction; css: typeof CSSFunction }): StylePropsResolver =>
  ({ tw, UNSAFE_class, css }) => {
    if (!tw && !UNSAFE_class && !css) {
      return;
    }

    let cssClass;
    if (css) {
      // @ts-expect-error ignore
      cssClass = cssFn(css);
    }

    const className = cx(UNSAFE_class, tx(tw, cssClass));

    return className;
  };
