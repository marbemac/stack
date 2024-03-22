/**
 * Merges multiple observables by emitting all items from all the observables.
 * Items are emitted in the order they appear.
 *
 * @typeparam T Type of items emitted by the observables.
 * @param streams Observables to combine.
 * @returns Observable that emits items from all observables.
 */
export function merge<T>(...os: ReadableStream<T>[]): ReadableStream<T> {
  return new ReadableStream<T>(
    {
      async start(controller) {
        const forwarders = os.map(async o => {
          const reader = o.getReader();
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              return;
            }
            controller.enqueue(value!);
          }
        });
        await Promise.all(forwarders);
        controller.close();
      },
    },
    { highWaterMark: 0 },
  );
}
