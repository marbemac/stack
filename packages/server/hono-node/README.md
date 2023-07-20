Adapted from https://github.com/honojs/node-server/tree/48f75da59b993d1b8fb8d9ef265e7dc08ce2cb97.

- Removes polyfills (requires node 18+)
- Allows setting response content-type when the response is a stream
- Adds an option to provide a connect app, which is then extended (so we can use vite dev server connect middleware)
