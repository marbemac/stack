import type { JSX } from 'solid-js';
import { createSignal, onMount, Show } from 'solid-js';

/**
 * If you also want to avoid including the relevant JS in the server bundle, use `isServer` to conditionally render null.
 * Here is an example:
 *
 * import { isServer } from 'solid-js/web';
 *
 * const HeavyLibrary = isServer ? null : lazy(() => import('@shared/ui-heavy').then(r => ({ default: r.HeavyLibrary })));
 *
 * const LazyHeavyLibrary: Component<HeavyLibraryProps> = props => {
 *   return <ClientOnly>{isServer || !HeavyLibrary ? null : <HeavyLibrary {...props} />}</ClientOnly>;
 * };
 */
export const ClientOnly = (props: { children: JSX.Element }) => {
  const [flag, setFlag] = createSignal(false);

  onMount(() => {
    setFlag(true);
  });

  return <Show when={flag()}>{props.children}</Show>;
};
