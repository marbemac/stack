import { readFile } from 'node:fs/promises';

import type { Context, Next } from 'hono';
import { getFilePath } from 'hono/utils/filepath';
import { getMimeType } from 'hono/utils/mime';

export type ServeStaticOptions = {
  root?: string;
  path?: string;
  index?: string; // default is 'index.html'
};

export const serveStatic = (options: ServeStaticOptions = { root: '' }) => {
  return async (c: Context, next: Next): Promise<Response | undefined> => {
    // Do nothing if Response is already set
    if (c.finalized) {
      await next();
    }
    const url = new URL(c.req.url);

    let path = getFilePath({
      filename: options.path ?? url.pathname,
      root: options.root,
      defaultDocument: options.index ?? 'index.html',
    });
    path = `./${path}`;

    try {
      const content = await readFile(path);
      if (content) {
        const mimeType = getMimeType(path);
        if (mimeType) {
          c.header('Content-Type', mimeType);
        }
        // Return Response object
        return c.body(content);
      }
    } catch (e) {
      console.warn(`Static file: ${path} is not found`);
    }

    await next();

    return;
  };
};
