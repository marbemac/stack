import { cx } from '@marbemac/ui-styles';
import { cssObjToString, type GeneratedTheme } from '@marbemac/ui-theme';

import type { PolymorphicComponent } from '../../utils/forward-ref.ts';
import { Style } from './style.tsx';
import { ThemeContext } from './theme-context.ts';

interface ThemedInnerProps {
  children: React.ReactNode;
  themeHash: string;
  generatedTheme: GeneratedTheme;
}

export const ThemedInner: PolymorphicComponent<'div', ThemedInnerProps> = ({
  children,
  themeHash,
  generatedTheme,
  UNSAFE_class,
  ...others
}) => {
  const themeClassName = `theme-${themeHash}`;
  const styles = cssObjToString({ [`.${themeClassName}`]: generatedTheme.css });

  return (
    <ThemeContext.Provider value={generatedTheme}>
      <div className={cx(themeClassName, UNSAFE_class)} {...others}>
        {children}

        <Style>
          {`
            ${styles}
          `}
        </Style>
      </div>
    </ThemeContext.Provider>
  );
};
