/**
 * Intentionally not exhaustive.. use as a basic check.
 */
export function isValidEmail(email: string): boolean {
  return /.+@.+/.test(email);
}
