// Adapted from https://github.com/solidjs/solid-start/blob/main/packages/start/root/Scripts.tsx

// import type { Manifest, ManifestEntry } from '@marbemac/server-ssr';

import { useRequest } from '../server-context.js';

export function Scripts() {
  const req = useRequest();

  return import.meta.env.SSR ? (
    import.meta.env.DEV ? (
      <>
        <script type="module" src="/@vite/client"></script>
        <script type="module" src="/src/entry-client.tsx"></script>
      </>
    ) : (
      // getMainEntryHref(req!.env.manifest!)
      <script type="module" src={`/${req.env.manifest!['entry-client']}`}></script>
    )
  ) : null;
}

// function getMainEntryHref(manifest: Manifest) {
//   let mainEntry: ManifestEntry | undefined;
//   for (const i in manifest) {
//     const entry = manifest[i];
//     if (entry?.isEntry) {
//       mainEntry = entry;
//       break;
//     }
//   }

//   if (!mainEntry) {
//     throw new Error('The manifest must have at one entry with isEntry=true.');
//   }

//   return <script type="module" async src={`/${mainEntry.file}`} />;
// }
