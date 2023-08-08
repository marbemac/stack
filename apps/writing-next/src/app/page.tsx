import { Box } from '@marbemac/ui-primitives-react';

export default function Home() {
  console.log('Home.render');

  return (
    <Box tw="p-2 text-danger">
      <h3>Welcome Home!</h3>
    </Box>
  );
}
