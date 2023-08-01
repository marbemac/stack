import type { StyleProps } from '@marbemac/ui-styles';

import { useStyleProps } from '../../provider.tsx';
import type { PolymorphicComponent } from '../../utils/forward-ref.ts';
import { polyRef } from '../../utils/forward-ref.ts';

export type BoxProps = StyleProps & {
  children?: React.ReactNode;
};

export const Box: PolymorphicComponent<'div', BoxProps> = props => {
  const { as: As = 'div', tw, UNSAFE_class, ...others } = props;

  const className = useStyleProps({ tw, UNSAFE_class });

  return <As {...others} className={className} />;
};

/**
 * Box component that supports a forwarded ref. Use only when you need to forward a ref.
 */
export const BoxRef = polyRef<'div', BoxProps>((props, ref) => {
  const { as: As = 'div', tw, UNSAFE_class, ...others } = props;

  const className = useStyleProps({ tw, UNSAFE_class });

  return <As {...others} ref={ref} className={className} />;
});
