import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { createServer } from 'node:http';

import type { Server as ConnectServer } from 'connect';
import connect from 'connect';
import { splitCookiesString } from 'set-cookie-parser';

import { writeReadableStreamToWritable } from './stream.js';

type FetchCallback = (request: Request) => Promise<unknown> | unknown;

type Options = {
  fetch: FetchCallback;
  port?: number;
  hostname?: string;
  serverOptions?: Record<string, unknown>;
  connectApp?: ConnectServer;
};

export const createAdaptorServer = (options: Options): Server => {
  const fetchCallback = options.fetch;
  const connnectApp = options.connectApp;

  const requestListener = getRequestListener(fetchCallback, connnectApp);
  const server: Server = createServer(options.serverOptions || {}, requestListener);

  return server;
};

export const serve = (options: Options): Server => {
  const server = createAdaptorServer(options);
  server.listen(options.port || 3000, options.hostname || '0.0.0.0');
  return server;
};

const getRequestListener = (fetchCallback: FetchCallback, connectApp?: ConnectServer) => {
  const app = connectApp || connect();

  app.use(async (incoming: IncomingMessage, outgoing: ServerResponse) => {
    const method = incoming.method || 'GET';
    const url = `http://${incoming.headers.host}${incoming.url}`;

    const headerRecord: Record<string, string> = {};
    const len = incoming.rawHeaders.length;
    for (let i = 0; i < len; i++) {
      if (i % 2 === 0) {
        const key = incoming.rawHeaders[i];
        const val = incoming.rawHeaders[i + 1];
        if (key !== void 0 && val !== void 0) {
          headerRecord[key] = val;
        }
      }
    }

    const init = {
      method: method,
      headers: headerRecord,
    } as RequestInit;

    if (!(method === 'GET' || method === 'HEAD')) {
      const buffers = [];
      for await (const chunk of incoming) {
        buffers.push(chunk);
      }
      const buffer = Buffer.concat(buffers);
      init['body'] = buffer;
    }

    let res: Response;

    try {
      res = (await fetchCallback(new Request(url.toString(), init))) as Response;
    } catch {
      res = new Response(null, { status: 500 });
    }

    const contentType = res.headers.get('content-type') || '';
    const contentEncoding = res.headers.get('content-encoding');

    const cookieVals = [];
    for (const [k, v] of res.headers) {
      if (k === 'set-cookie') {
        cookieVals.push(res.headers.get(k));
      } else {
        outgoing.setHeader(k, v);
      }
    }

    // This makes sure that when translating from fetch -> node, if multiple set-cookie values are present, they are preserved
    // in a way that node understands (as an array).
    let parsedCookieVals: string[] = [];
    if (cookieVals.length) {
      parsedCookieVals = parsedCookieVals.concat(...cookieVals.map(c => splitCookiesString(c as any)));

      parsedCookieVals = [...new Set(parsedCookieVals)];
      if (parsedCookieVals.length) {
        outgoing.setHeader('set-cookie', parsedCookieVals);
      }
    }

    outgoing.statusCode = res.status;

    if (res.body) {
      if (!contentEncoding && contentType.startsWith('text')) {
        outgoing.end(await res.text());
      } else if (!contentEncoding && contentType.startsWith('application/json')) {
        outgoing.end(await res.text());
      } else {
        // TODO: allow setting content-type response header when using stream?
        await writeReadableStreamToWritable(res.body, outgoing);
      }
    } else {
      outgoing.end();
    }
  });

  return app;
};
