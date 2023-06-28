import { STYLE_PROPS, type StyleProps } from '@marbemac/ui-styles';
import { createMemo, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { createPolymorphicComponent } from '../../utils/polymorphic.ts';
import { styledClass } from '../../utils/styles.ts';

export type BoxProps = StyleProps;

export const Box = createPolymorphicComponent<'div', BoxProps>(p => {
  const props = mergeProps(
    // defaults
    {
      as: 'div' as const,
    },
    p,
  );

  const [local, styleProps, others] = splitProps(props, ['as', 'asProps'], STYLE_PROPS);

  const className = createMemo(() => styledClass(styleProps));

  return <Dynamic {...local.asProps} {...others} component={local.as} class={className()} />;
});
