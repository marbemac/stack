import { tw } from '@marbemac/ui-styles';
import type { LinkProps as BaseLinkProps } from 'react-router-dom';
import { Link as BaseLink } from 'react-router-dom';

// import type { Routes } from 'remix-routes';
// import { tw } from '~/primitive-styles/tw.ts';
import type { RoutePaths } from '~/routes.tsx';

import type { TwProp } from '../types.ts';
import { forwardRef } from '../utils.ts';

type BaseProps = Pick<
  BaseLinkProps,
  'className' | 'replace' | 'preventScrollReset' | 'state' | 'reloadDocument' | 'children'
>;

export type LinkProps = BaseProps &
  (
    | { href: RoutePaths; UNSAFE_href?: BaseLinkProps['to'] }
    | { href?: RoutePaths; UNSAFE_href: BaseLinkProps['to'] }
  ) & {
    tw?: TwProp;
  };

function LinkInner(
  { href, UNSAFE_href, tw: _tw, className, ...rest }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return <BaseLink ref={ref} to={href || UNSAFE_href} className={tw(_tw, className)} {...rest} />;
}

export const Link = forwardRef(LinkInner);

Link.displayName = 'UI.Link';
