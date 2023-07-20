import type { InlineOptions } from '@twind/core';

import { createState } from './internal.js';

const encoder = /* #__PURE__ */ new TextEncoder();
const decoder = /* #__PURE__ */ new TextDecoder();

export class TwindStream extends TransformStream<Uint8Array, Uint8Array> {
  constructor(options?: InlineOptions['tw'] | InlineOptions) {
    const state = createState(options);

    const flush = (controller: TransformStreamDefaultController<Uint8Array>) => {
      const markup = state.flush();
      if (markup) {
        controller.enqueue(encoder.encode(markup));
      }
    };

    super({
      transform(chunk, controller) {
        if (state.push(decoder.decode(chunk))) {
          return flush(controller);
        }
      },
      flush,
    });
  }
}
