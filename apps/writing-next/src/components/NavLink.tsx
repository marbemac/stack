'use client';

import type { StyleProps, TwProp } from '@marbemac/ui-styles';
import { cx } from '@marbemac/ui-styles';
import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

type NextProps<T> = Pick<NextLinkProps<T>, 'href' | 'replace' | 'scroll' | 'shallow' | 'locale' | 'prefetch' | 'title'>;

export type NavLinkProps<T> = StyleProps &
  NextProps<T> & {
    children: React.ReactNode;
    exact?: boolean;
    twInactive?: TwProp;
    twActive?: TwProp;
    inactiveProps?: Partial<NextProps<T>>;
    activeProps?: Partial<NextProps<T>>;
  };

export const NavLink = <T extends string>({
  href,
  exact,
  tw,
  twInactive,
  twActive,
  UNSAFE_class,
  inactiveProps = {},
  activeProps = {},
  ...rest
}: NavLinkProps<T>) => {
  const pathname = usePathname();
  const hrefString = typeof href === 'string' ? href : href.pathname || '';
  const isActive = exact ? pathname === hrefString : pathname.startsWith(hrefString);

  const stateTw = isActive ? twActive : twInactive;
  const stateProps = isActive ? activeProps : inactiveProps;

  return <NextLink href={href} className={cx(UNSAFE_class, tw, stateTw)} {...rest} {...stateProps} />;
};

NavLink.displayName = 'NavLink';
