export type Transform<S, T = S> = TransformStream<S, T>;

export interface TransformError {
  error: unknown;
  meta?: unknown;
}

export type ErrorWriter = WritableStreamDefaultWriter<TransformError>;

export interface TransformOpts {
  errorWriter?: ErrorWriter;
}
