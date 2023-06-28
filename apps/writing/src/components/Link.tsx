import { styledClass } from '@marbemac/ui-primitives';
import { STYLE_PROPS, type StyleProps, type TW_STR } from '@marbemac/ui-styles';
import { A, type AnchorProps } from '@solidjs/router';
import { createMemo, splitProps } from 'solid-js';

export interface LinkProps extends Omit<AnchorProps, 'activeClass' | 'inactiveClass'>, StyleProps {
  activeTw?: TW_STR;
  inactiveTw?: TW_STR;
}

export const Link = (props: LinkProps) => {
  const [local, styleProps, others] = splitProps(props, ['activeTw', 'inactiveTw'], STYLE_PROPS);

  const className = createMemo(() => styledClass(styleProps));
  const activeClass = createMemo(() => styledClass({ tw: local.activeTw }));
  const inactiveClass = createMemo(() => styledClass({ tw: local.inactiveTw }));

  return <A {...others} class={className()} activeClass={activeClass()} inactiveClass={inactiveClass()} />;
};
