import { VStack } from '@marbemac/ui-primitives-react';
import { Link } from '@tanstack/router';

export const SiteNav = () => {
  return (
    <VStack spacing={2}>
      <Link
        to="/"
        activeProps={{
          className: 'font-bold',
        }}
        activeOptions={{ exact: true }}
      >
        Home
      </Link>

      <Link
        to="/posts"
        activeProps={{
          className: 'font-bold',
        }}
      >
        Posts
      </Link>

      <Link
        to="/debug"
        activeProps={{
          className: 'font-bold',
        }}
      >
        Debug
      </Link>
    </VStack>
  );
};
