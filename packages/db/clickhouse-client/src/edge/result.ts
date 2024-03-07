import { splitStream } from '@marbemac/utils-streams';

import type { DataFormat, ResultSetStreamRow } from '../types.ts';
import { decode } from './formatter.ts';
import { getAsText, streamToRow } from './streams.ts';

export class ResultSet {
  #consumed: 'text' | 'json' | 'stream' | null = null;

  constructor(
    private _stream: ReadableStream,
    private readonly format: DataFormat,
    public readonly query_id: string,
  ) {}

  #assertSingleConsumption(src: 'text' | 'json' | 'stream') {
    if (this.#consumed && this.#consumed !== src) {
      throw Error(streamAlreadyConsumedMessage);
    }

    this.#consumed = src;
  }

  async #decodeText(): Promise<string> {
    return (await getAsText(this._stream)).toString();
  }

  /**
   * The method waits for all the rows to be fully loaded
   * and returns the result as a string.
   *
   * The method will throw if the underlying stream was already consumed
   * by calling the other methods.
   */
  async text(): Promise<string> {
    this.#assertSingleConsumption('text');

    return this.#decodeText();
  }

  /**
   * The method waits for the all the rows to be fully loaded.
   * When the response is received in full, it will be decoded to return JSON.
   *
   * The method will throw if the underlying stream was already consumed
   * by calling the other methods.
   */
  async json<T>(): Promise<T> {
    this.#assertSingleConsumption('json');

    return decode(await this.#decodeText(), this.format);
  }

  /**
   * Returns a readable stream for responses that can be streamed
   * (i.e. all except JSON).
   *
   * Every iteration provides an array of {@link Row} instances
   * for {@link StreamableDataFormat} format.
   *
   * Should be called only once.
   *
   * The method will throw if called on a response in non-streamable format,
   * and if the underlying stream was already consumed
   * by calling the other methods.
   */
  stream<T>(): ReadableStream<ResultSetStreamRow<T>[]> {
    this.#assertSingleConsumption('stream');

    return this._stream
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(splitStream('\n'))
      .pipeThrough(streamToRow<T>());
  }

  async close() {
    await this._stream.cancel('close() called');
  }
}

export const streamAlreadyConsumedMessage = 'Stream has been already consumed';
