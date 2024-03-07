import { lazy, Suspense, useEffect, useState } from 'react';

export { ClientOnly };

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
function ClientOnly(props: ClientOnlyProps) {
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
