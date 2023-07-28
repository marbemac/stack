import { Suspense } from 'solid-js';

import { Link } from '~/components/Link.tsx';
import { useTrpc } from '~/utils/trpc.ts';

export default function Debug() {
  return (
    <div>
      <h1>DEBUG</h1>
      <Link href="/">Go home</Link>
      <Inner wait={1000} />
      <Inner wait={2000} />
      <Inner wait={3000} />
      <Inner wait={4000} />
      <Inner wait={5000} />
      <Inner wait={6000} />
      <Inner wait={7000} />
    </div>
  );
}

const Inner = (props: { wait: number }) => {
  const query = useTrpc().posts.nested.wait.useQuery(() => ({ wait: props.wait }));

  return (
    <Suspense fallback={<div>{`waiting ${props.wait}...`}</div>}>
      <div>result {query.data}</div>
    </Suspense>
  );
};
