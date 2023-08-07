'use client';

import { cx } from '@marbemac/ui-styles';
import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

type NextProps<T> = Pick<
  NextLinkProps<T>,
  'className' | 'href' | 'replace' | 'scroll' | 'shallow' | 'locale' | 'prefetch' | 'title'
>;

export type LinkProps<T> = NextProps<T> & {
  children: React.ReactNode;
  exact?: boolean;
  inactiveProps?: Partial<LinkProps<T>>;
  activeProps?: Partial<LinkProps<T>>;
};

export const NavLink = <T extends string>({
  href,
  exact,
  className,
  inactiveProps = {},
  activeProps = {},
  ...rest
}: LinkProps<T>) => {
  const pathname = usePathname();
  const hrefString = typeof href === 'string' ? href : href.pathname || '';
  const isActive = exact ? pathname === hrefString : pathname.startsWith(hrefString);

  const stateProps = isActive ? activeProps : inactiveProps;
  const { className: stateClassname, ...otherStateProps } = stateProps;

  return (
    <NextLink
      href={href}
      data-state={isActive ? 'active' : 'inactive'}
      className={cx(className, stateClassname)}
      {...rest}
      {...otherStateProps}
    />
  );
};

NavLink.displayName = 'NavLink';
