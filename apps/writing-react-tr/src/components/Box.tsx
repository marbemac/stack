import { styledClass } from '@marbemac/ui-primitives-solid';
import { type StyleProps } from '@marbemac/ui-styles';
import { forwardRef, useMemo } from 'react';

export interface BoxProps extends StyleProps {
  children?: React.ReactNode;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(props, ref) {
  const { UNSAFE_class, tw, as, ...rest } = props;

  const className = useMemo(() => styledClass({ UNSAFE_class, tw }), [UNSAFE_class, tw]);

  return <div {...rest} ref={ref} className={className} />;
});
