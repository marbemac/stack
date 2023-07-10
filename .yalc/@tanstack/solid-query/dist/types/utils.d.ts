export declare function shouldThrowError<T extends (...args: any[]) => boolean>(throwError: boolean | T | undefined, params: Parameters<T>): boolean;
