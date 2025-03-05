import { createContext, lazy, Suspense, useContext, useEffect, useState } from 'react';

export function useComponentHydrated() {
  // Once useEffect() has been called,
  // we know the app has been hydrated.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

export const HydrationContext = createContext<boolean | undefined>(undefined);

export const useHydrated = (): boolean => {
  const hydrated = useContext(HydrationContext);

  if (hydrated === undefined) {
    console.warn('useHydrated must be used within a HydrationProvider');
  }

  return !!hydrated;
};

export const HydrationProvider = ({ children }: { children: React.ReactNode }) => {
  const hydrated = useComponentHydrated();

  return <HydrationContext.Provider value={hydrated}>{children}</HydrationContext.Provider>;
};

export const ServerOnly = ({ children }: { children: React.ReactNode }) => {
  const hydrated = useHydrated();
  return !hydrated ? <>{children}</> : null;
};

export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const hydrated = useHydrated();
  return hydrated ? <>{children}</> : null;
};

interface LazyClientOnlyProps {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback: React.ReactNode;
}

/**
 * @example
 * <LazyClientOnly
 *   component={() => import('some-heavy-or-browser-only-component')}
 *   fallback={<Loading />}
 * />
 */
export function LazyClientOnly(props: LazyClientOnlyProps) {
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
