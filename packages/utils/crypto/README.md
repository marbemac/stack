# @marbemac/utils-crypto

## Signing Requests

Use `signRequest` and `verifySignedRequest` to securely send requests between services over the public internet.

This is helpful, for example, for use cases such as vercel -> cloudflare requests. These are two different systems,
without a stable IP to allowlist.

**1. Create the request**

For example, let's say that a nextjs server action needs to trigger a cloudflare worker that's been exposed at a given
URL.

```ts
import { signRequest } from '@marbemac/utils-crypto';

// create the request
const req = new Request(workerUrl, {
  method: 'post',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

// SOME_SIGNING_SECRET most likely will come from an env variable. Or it could be a per user/org secret if signing webshooks, etc.
// The same secret must be used on the receiving end to verify the signed request.
await signRequest(req, SOME_SIGNING_SECRET);

// ...send the request
const res = await fetch(req);
```

**2. Verify the incoming signed requests**

```ts
import { verifySignedRequest } from '@marbemac/utils-crypto';

export default handler = {
  fetch(req) {
    try {
      // the same secret from step 1 - either env variable, or fetched from DB for particular org/user, etc...
      await verifySignedRequest(req, SOME_SIGNING_SECRET);
    } catch (err) {
      console.warn('verifySignedRequest fail', String(err), req.url);

      // return an error response, etc...
    }
  },
};
```
