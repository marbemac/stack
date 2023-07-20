import { Link } from '~/components/Link.tsx';

export default function Home() {
  return (
    <div>
      Home - <Link href="/posts">Posts</Link> - <Link href="/debug">Debug</Link>
    </div>
  );
}
