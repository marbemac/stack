export function shouldThrowError(throwError, params) {
    // Allow throwError function to override throwing behavior on a per-error basis
    if (typeof throwError === 'function') {
        return throwError(...params);
    }
    return !!throwError;
}
