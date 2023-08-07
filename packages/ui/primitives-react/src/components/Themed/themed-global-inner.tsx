'use client';

import { cssObjToString, type GeneratedTheme } from '@marbemac/ui-theme';

import { GlobalThemeContext } from './theme-context.ts';

type ThemedGlobalInnerProps = {
  children: React.ReactNode;
  generatedTheme: GeneratedTheme;
  generatedDarkTheme?: GeneratedTheme;
};

export const ThemedGlobalInner = ({ children, generatedTheme, generatedDarkTheme }: ThemedGlobalInnerProps) => {
  const styles = cssObjToString({ ':root': generatedTheme.css });
  const darkStyles = generatedDarkTheme ? cssObjToString({ ':root': generatedDarkTheme.css }) : '';

  return (
    <GlobalThemeContext.Provider value={generatedTheme}>
      {children}

      <style jsx global>
        {`
          ${styles}

          @media (prefers-color-scheme: dark) {
            ${darkStyles}
          }
        `}
      </style>
    </GlobalThemeContext.Provider>
  );
};
