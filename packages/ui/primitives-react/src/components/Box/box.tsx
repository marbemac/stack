import type { StyleProps } from '@marbemac/ui-styles';

import { useStyleProps } from '../../provider.tsx';
import { polyRef } from '../../utils/forward-ref.ts';

export type BoxProps = StyleProps & {
  children?: React.ReactNode;
};

export const Box = polyRef<'div', BoxProps>((props, ref) => {
  const { as: As = 'div', tw, UNSAFE_class, ...others } = props;

  const className = useStyleProps({ tw, UNSAFE_class });

  return <As {...others} ref={ref} className={className} />;
});
