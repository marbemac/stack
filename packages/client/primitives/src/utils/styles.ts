import type { StyleProps } from '@marbemac/ui-styles';
import { apply, cx, tw, tx } from '@marbemac/ui-twind';

export const styledClass = (props: StyleProps) => {
  if (props.UNSAFE_class || props.tw) {
    // Something potentially weird here, for now - call before returning
    const className = tx(props.UNSAFE_class, props.tw);
    // const className = cx(props.UNSAFE_class, props.tw);
    // const className = tw(apply(props.UNSAFE_class, props.tw));

    return className;
  }

  // return an actual value (not undefined) but casting to string | undefined
  // due to weird issue with solid suspense. passing to the solid "class" prop should be ok, just a typing issue
  return null as unknown as undefined;
};
