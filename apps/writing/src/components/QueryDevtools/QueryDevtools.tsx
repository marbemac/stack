import type { DevtoolsButtonPosition, DevToolsErrorType, DevtoolsPosition } from '@tanstack/query-devtools';
import { TanstackQueryDevtools } from '@tanstack/query-devtools';
import type { QueryClient } from '@tanstack/solid-query';
import { onlineManager, useQueryClient } from '@tanstack/solid-query';
import { createComputed, on, onCleanup, onMount } from 'solid-js';

export interface DevtoolsOptions {
  /**
   * Set this true if you want the dev tools to default to being open
   */
  initialIsOpen?: boolean;
  /**
   * The position of the React Query logo to open and close the devtools panel.
   * 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
   * Defaults to 'bottom-left'.
   */
  buttonPosition?: DevtoolsButtonPosition;
  /**
   * The position of the React Query devtools panel.
   * 'top' | 'bottom' | 'left' | 'right'
   * Defaults to 'bottom'.
   */
  position?: DevtoolsPosition;
  /**
   * Custom instance of QueryClient
   */
  client?: QueryClient;
  /**
   * Use this so you can define custom errors that can be shown in the devtools.
   */
  errorTypes?: DevToolsErrorType[];
}

export function SolidQueryDevtools(props: DevtoolsOptions) {
  const queryClient = useQueryClient();
  const client = props.client || queryClient;
  let ref: HTMLDivElement;

  const devtools = new TanstackQueryDevtools({
    client: client,
    queryFlavor: 'Solid Query',
    version: '5',
    onlineManager,
    buttonPosition: props.buttonPosition,
    position: props.position,
    initialIsOpen: props.initialIsOpen,
    errorTypes: props.errorTypes,
  });

  createComputed(
    on(
      () => props.buttonPosition,
      i => (i ? devtools.setButtonPosition(i) : undefined),
      { defer: true },
    ),
  );

  createComputed(
    on(
      () => props.position,
      i => (i ? devtools.setPosition(i) : undefined),
      { defer: true },
    ),
  );

  createComputed(
    on(
      () => props.initialIsOpen,
      i => (i ? devtools.setInitialIsOpen(i) : undefined),
      { defer: true },
    ),
  );

  createComputed(
    on(
      () => props.errorTypes,
      i => (i ? devtools.setErrorTypes(i) : undefined),
      { defer: true },
    ),
  );

  onMount(() => {
    devtools.mount(ref);

    onCleanup(() => devtools.unmount());
  });

  return <div ref={ref!} />;
}
