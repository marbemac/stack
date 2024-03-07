type Props = {
  children: string;
  global?: boolean;
};

/**
 * This wrapper is simply to avoid react console warnings
 *
 * https://stackoverflow.com/questions/57261540/warning-received-true-for-a-non-boolean-attribute-jsx-zeit-styled-jsx
 */
export function Style({ children, global = false }: Props) {
  // @ts-expect-error ignore, bad typings
  return <style {...{ jsx: 'true', global: global ? 'true' : 'false' }}>{children}</style>;
}
