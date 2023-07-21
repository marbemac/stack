import { styledClass } from '@marbemac/ui-primitives';
import { STYLE_PROPS, type StyleProps, type TW_STR } from '@marbemac/ui-styles';
import { A, type AnchorProps } from '@solidjs/router';
import { createMemo, splitProps } from 'solid-js';

import type { AppRoutes } from '~/routes.tsx';

export type LinkProps = Omit<AnchorProps, 'href' | 'activeClass' | 'inactiveClass'> &
  StyleProps & {
    activeTw?: TW_STR;
    inactiveTw?: TW_STR;
  } & ({ href: AppRoutes; UNSAFE_href?: string } | { href?: AppRoutes; UNSAFE_href: string });

export const Link = (props: LinkProps) => {
  const [local, styleProps, others] = splitProps(props, ['href', 'UNSAFE_href', 'activeTw', 'inactiveTw'], STYLE_PROPS);

  const className = createMemo(() => styledClass(styleProps));
  const activeClass = createMemo(() => styledClass({ tw: local.activeTw }));
  const inactiveClass = createMemo(() => styledClass({ tw: local.inactiveTw }));

  return (
    <A
      {...others}
      href={(local.href || local.UNSAFE_href)!}
      class={className()}
      activeClass={activeClass()}
      inactiveClass={inactiveClass()}
    />
  );
};
