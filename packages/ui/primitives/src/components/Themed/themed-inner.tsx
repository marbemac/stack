import { cx } from '@marbemac/ui-styles';
import { cssObjToString, type GeneratedTheme } from '@marbemac/ui-theme';
import { forwardRef } from 'react';

import { Style } from './style.tsx';
import { ThemeContext } from './theme-context.ts';
import { createElement, type Options, type Props } from '../../utils/composition.tsx';

interface ThemedInnerOptions extends Options {
  themeHash: string;
  generatedTheme: GeneratedTheme;
}

export type ThemedInnerProps<T extends React.ElementType = 'div'> = Props<T, ThemedInnerOptions>;

export const ThemedInner = forwardRef<HTMLDivElement, ThemedInnerProps>(function ThemedInner(originalProps, ref) {
  const { children, themeHash, generatedTheme, className, ...props } = originalProps;

  const themeClassName = `theme-${themeHash}`;
  const styles = cssObjToString({ [`.${themeClassName}`]: generatedTheme.css });

  return (
    <ThemeContext.Provider value={generatedTheme}>
      {createElement('div', {
        ...props,
        ref,
        className: cx(themeClassName, className),
        children: (
          <>
            {children}

            <Style>
              {`
    ${styles}
  `}
            </Style>
          </>
        ),
      })}
    </ThemeContext.Provider>
  );
});
