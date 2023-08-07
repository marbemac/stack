import { Box } from '@marbemac/ui-primitives-react';

import { NavLink } from './NavLink.tsx';

export const SiteNav = () => {
  return (
    <Box tw="flex flex-col gap-2">
      <NavLink href="/" twActive="font-bold" exact>
        Home
      </NavLink>

      <NavLink href="/posts" twActive="font-bold">
        Posts
      </NavLink>

      {/* <NavLink href="/debug">Debug</NavLink> */}
    </Box>
  );
};
