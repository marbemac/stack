# @shared/server-ssr

Functions to help put together servers that:

1. Render + stream solid js.
2. Mount a TRPC router, and make that router available via HTTP and direct caller (useful during SSR to avoid http round
   trips).
3. Twind streaming.

A hot reloading dev version is available at `import { createDevServer } from '@shared/server-ssr/create-dev-server';`.

## Basic request flow

```
HTTP Request
   |
   V
   `global` middlware sets things like db instances on hono ctx
   |
   V
   `setAuthConfig` middleware (`@shared/auth-external-api`) sets auth config on hono ctx
   |
   V
   `setSession` middleware (`@shared/auth-external-api`) parses session cookie token and sets session on ctx, if user is authenticated
   |
   V
   `/api/*` request? gets handled by `@shared/auth-external-api`
   |
   V
   `/_/rpc/*` request? gets handled by `{app}/internal-api`. The hono req ctx is passed through as the trpc req ctx, so it is available in trpc as well.
   |
   V
   All other requests get handled by `@shared/server-ssr`
```
