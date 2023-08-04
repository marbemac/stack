import { NavLink } from './NavLink.tsx';

export const SiteNav = () => {
  return (
    <div className="flex flex-col gap-2">
      <NavLink href="/" exact activeProps={{ className: 'font-bold' }}>
        Home
      </NavLink>

      <NavLink href="/posts" activeProps={{ className: 'font-bold' }}>
        Posts
      </NavLink>

      {/* <NavLink href="/debug">Debug</NavLink> */}
    </div>
  );
};
