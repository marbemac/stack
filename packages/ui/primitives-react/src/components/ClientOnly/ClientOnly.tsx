import { lazy, Suspense, useEffect, useState } from 'react';

export { ClientOnly };

type ClientOnlyProps = {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback: React.ReactNode;
};

function ClientOnly(props: ClientOnlyProps) {
  const [Component, setComponent] = useState(() => props.fallback);

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
