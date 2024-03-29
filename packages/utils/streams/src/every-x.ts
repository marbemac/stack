import type { Transform } from './types.ts';

/**
 * Invoke the callback every `count` items, with the first and last item from that chunk of items.
 *
 * Will call one last time for the last chunk of items, even if it's less than `count`.
 */
export function everyX<T>({
  count,
  after,
}: {
  count: number;
  after: (props: { first: T | null; last: T | null }) => void;
}): Transform<T, T> {
  let counter = 0;
  let first: T | null = null;
  let last: T | null = null;

  return new TransformStream<T, T>(
    {
      async transform(chunk, controller) {
        counter++;
        controller.enqueue(chunk);

        if (counter === 1) {
          first = chunk;
        }

        last = chunk;

        if (counter >= count) {
          after({ first, last });
          counter = 0;
          last = null;
        }
      },
      flush() {
        if (counter >= 1) {
          after({ first, last });
        }
      },
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );
}
