import type { JSXElement } from 'solid-js';
import { useContext } from 'solid-js';
import { useAssets } from 'solid-js/web';

import { ServerContext } from '../server-context.js';
import type { Manifest, ManifestEntry } from '../types.js';

function getAssetsFromManifest(manifest: Manifest) {
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

  const links = (mainEntry.imports || []).reduce((r, src) => {
    const target = manifest[src];
    if (!target) return r;

    r[target.file] = <link rel="modulepreload" href={`/${target.file}`} $ServerOnly />;

    return r;
  }, {} as Record<string, JSXElement>);

  return Object.values(links);
}

/**
 * Links are used to load assets for the server rendered HTML
 * @returns {JSXElement}
 */
export function Links() {
  const isDev = import.meta.env.MODE === 'development';
  const context = useContext(ServerContext);

  if (!isDev) {
    useAssets(() => getAssetsFromManifest(context!.env.manifest!));
  }

  return null;
}
