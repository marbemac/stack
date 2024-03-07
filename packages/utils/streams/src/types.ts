export type Transform<S, T = S> = TransformStream<S, T>;

export type TransformError = { error: unknown; meta?: unknown };

export type TransformOpts = {
  errorWriter?: WritableStreamDefaultWriter<TransformError>;
};
