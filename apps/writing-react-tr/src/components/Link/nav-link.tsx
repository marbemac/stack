'use client';

import { styledClass } from '@marbemac/ui-primitives-solid';
import type { TW_STR } from '@marbemac/ui-styles';
import { cx } from '@marbemac/ui-twind';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { forwardRef } from '../utils.ts';
import type { LinkProps } from './link.tsx';
import { Link } from './link.tsx';

export type NavLinkProps = LinkProps & {
  exact?: boolean;
  activeTw?: TW_STR;
  inactiveTw?: TW_STR;
};

function NavLinkInner(
  { exact, href, UNSAFE_href, tw, activeTw, inactiveTw, ...rest }: NavLinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  const { pathname } = useLocation();
  const hrefString = href ? href : typeof UNSAFE_href === 'string' ? href : UNSAFE_href?.pathname || '';
  const isActive = exact ? pathname === hrefString : pathname.startsWith(hrefString);
  const ariaCurrent = isActive ? 'page' : undefined;

  const className = useMemo(() => styledClass({ tw }), [tw]);
  const activeClass = useMemo(() => styledClass({ tw: activeTw }), [activeTw]);
  const inactiveClass = useMemo(() => styledClass({ tw: inactiveTw }), [inactiveTw]);

  return (
    <Link
      ref={ref}
      href={href}
      UNSAFE_href={UNSAFE_href}
      aria-current={ariaCurrent}
      className={cx(className, isActive && activeClass, !isActive && inactiveClass)}
      {...rest}
    />
  );
}

/**
 * NavLink supports targeting active/inactive state via `ui-state-active:` and `ui-state-inactive:` tailwind variants.
 */
export const NavLink = forwardRef(NavLinkInner);

NavLink.displayName = 'UI.NavLink';
