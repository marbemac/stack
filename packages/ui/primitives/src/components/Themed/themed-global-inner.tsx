import { cssObjToString, type GeneratedTheme } from '@marbemac/ui-theme';

import { Style } from './style.tsx';
import { GlobalThemeContext } from './theme-context.ts';

interface ThemedGlobalInnerProps {
  children: React.ReactNode;
  generatedTheme: GeneratedTheme;
  generatedDarkTheme?: GeneratedTheme;
}

export const ThemedGlobalInner = ({ children, generatedTheme, generatedDarkTheme }: ThemedGlobalInnerProps) => {
  const styles = cssObjToString({ ':root': generatedTheme.css });
  const darkStyles = generatedDarkTheme ? cssObjToString({ ':root': generatedDarkTheme.css }) : '';

  return (
    <GlobalThemeContext.Provider value={generatedTheme}>
      {children}

      <Style global>
        {`
              ${styles}

              @media (prefers-color-scheme: dark) {
                ${darkStyles}
              }
            `}
      </Style>
    </GlobalThemeContext.Provider>
  );
};
