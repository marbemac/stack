import type { Transform, TransformOpts } from './types.ts';

/**
 * Calls a function for each item emitted by an observable without
 * waiting for the function to return to forward the item.
 * Exceptions thrown by the function will be caught and ignored.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param f Function called with each emitted value.
 * @returns Transform that emits the same items as the original observable.
 */
export function forEach<T>(f: (x: T) => Promise<unknown> | unknown, opts?: TransformOpts): Transform<T> {
  return new TransformStream<T, T>(
    {
      async transform(chunk, controller) {
        controller.enqueue(chunk);
        try {
          await f(chunk);
        } catch (error) {
          if (opts?.errorWriter) {
            void opts.errorWriter.write({ error });
          } else {
            // noop
          }
        }
      },
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );
}
