import type { StyleProps } from '@marbemac/ui-styles';
import { tx } from '@marbemac/ui-twind';

export const STYLED_PROPS = ['tw', 'UNSAFE_class'] as const;

export const styledClass = (props: StyleProps) => {
  if (props.UNSAFE_class || props.tw) {
    // Something potentially weird here, for now - call before returning
    const className = tx(props.UNSAFE_class, props.tw);

    return className;
  }

  return;
};
