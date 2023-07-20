// Adapted from https://github.com/solidjs/solid-start/blob/main/packages/start/root/Scripts.tsx

import type { Manifest, ManifestEntry } from '@marbemac/server-ssr';
import { HydrationScript, isServer, NoHydration } from 'solid-js/web';

import { useRequest } from '../server-context.js';

const isDev = import.meta.env.MODE === 'development';

export function Scripts() {
  const req = useRequest();

  return (
    <>
      <HydrationScript />

      <NoHydration>
        {isServer ? (
          isDev ? (
            <>
              <script type="module" src="/@vite/client" $ServerOnly></script>
              <script type="module" src="/src/entry-client.tsx" $ServerOnly></script>
            </>
          ) : (
            getMainEntryHref(req!.env.manifest!)
          )
        ) : null}
      </NoHydration>
    </>
  );
}

function getMainEntryHref(manifest: Manifest) {
  let mainEntry: ManifestEntry | undefined;
  for (const i in manifest) {
    const entry = manifest[i];
    if (entry?.isEntry) {
      mainEntry = entry;
      break;
    }
  }

  if (!mainEntry) {
    throw new Error('The manifest must have at one entry with isEntry=true.');
  }

  return <script type="module" async src={`/${mainEntry.file}`} $ServerOnly />;
}
