import { lazy, Suspense, useEffect, useState } from 'react';

interface ClientOnlyProps {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback: React.ReactNode;
}

/**
 * @example
 * <ClientOnly
 *   component={() => import('some-heavy-or-browser-only-component')}
 *   fallback={<Loading />}
 * />
 */
export function ClientOnly(props: ClientOnlyProps) {
  const [Component, setComponent] = useState(() => () => props.fallback);

  useEffect(() => {
    setComponent(() => lazy(props.component) as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={props.fallback}>
      <Component />
    </Suspense>
  );
}

interface NoSsrProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function NoSsr(props: NoSsrProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  if (!isClient) {
    return null;
  }

  return <Suspense fallback={props.fallback}>{props.children}</Suspense>;
}
