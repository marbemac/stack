import type { StyleProps } from '@marbemac/ui-styles';
import { createMemo, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { createPolymorphicComponent } from '../../utils/polymorphic.ts';
import { STYLED_PROPS, styledClass } from '../../utils/styles.ts';

export type BoxProps = StyleProps;

export const Box = createPolymorphicComponent<'div', BoxProps>(p => {
  const props = mergeProps(
    // defaults
    {
      as: 'div' as const,
    },
    p,
  );

  const [local, styleProps, others] = splitProps(props, ['as', 'asProps'], STYLED_PROPS);

  const className = createMemo(() => styledClass(styleProps));

  return <Dynamic component={local.as} {...local.asProps} {...others} class={className()} />;
});
