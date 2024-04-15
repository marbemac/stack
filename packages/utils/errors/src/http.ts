import { getStatusCodeFromKey, type ERROR_CODE_KEY } from './codes.ts';

interface HTTPExceptionOptions {
  message?: string;
  detail?: string;
  cause?: unknown;
}

// https://datatracker.ietf.org/doc/html/rfc7807
export interface HttpExceptionResponseShape {
  title: string;
  status: number;
  detail?: string;
  type?: string;
}

/**
 * `HTTPException` must be used when a fatal error such as authentication failure occurs.
 *
 * Use `.getResponse()` to get a `Response` object that can be sent to the client.
 */
export class HTTPException extends Error {
  readonly status: number;
  readonly code: ERROR_CODE_KEY;
  readonly detail?: string;

  constructor(code: ERROR_CODE_KEY, opts: HTTPExceptionOptions) {
    super(opts?.message, { cause: opts?.cause });
    this.code = code;
    this.status = getStatusCodeFromKey(code);
    this.detail = opts.detail;
  }

  getResponse(): Response {
    const body: HttpExceptionResponseShape = {
      title: this.message,
      status: this.status,
      detail: this.detail,

      // @TODO - need consumer to be able to set mapping of codes -> documentation URLs
      // type: ''
    };

    return new Response(JSON.stringify(body), {
      status: this.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
