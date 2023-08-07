/**
 * Merge default and component props into a single props object.
 * @param defaultProps The default props, will be overridden by component props.
 * @param props The component `props` object.
 * @example
 * // mergedProps = defaultProps <== props
 */
export function mergeStyleProps<T extends Record<string, any>>(defaultProps: Partial<T>, props: T): T {
  return Object.assign({}, defaultProps, props);
}
