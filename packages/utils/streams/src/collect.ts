/**
 * Collects all values from the observable into an array.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param o Observable to collect from.
 * @returns Promise that resolves with an array.
 */
export async function collect<T>(o: ReadableStream<T>): Promise<T[]> {
  const buffer: T[] = [];
  const reader = o.getReader();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      return buffer;
    }
    buffer.push(value!);
  }
}
