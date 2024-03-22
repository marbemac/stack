export type Transform<S, T = S> = TransformStream<S, T>;

export interface TransformError {
  error: unknown;
  meta?: unknown;
}

export interface TransformOpts {
  errorWriter?: WritableStreamDefaultWriter<TransformError>;
}
