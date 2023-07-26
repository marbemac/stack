import type { Manifest, ManifestEntry } from '@marbemac/server-ssr';

import { fastRefreshPreamble } from '../fast-refresh-preamble.ts';
import { useRequest } from '../server-context.tsx';

export function Scripts() {
  const req = useRequest();

  return import.meta.env.SSR ? (
    import.meta.env.DEV ? (
      <>
        <script
          type="module"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: fastRefreshPreamble,
          }}
        />
        <script type="module" src="/@vite/client" />
        <script type="module" src="/src/entry-client.tsx" />
      </>
    ) : (
      getMainEntryHref(req!.env.manifest!)
    )
  ) : null;
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

  return <script type="module" async src={`/${mainEntry.file}`} />;
}
