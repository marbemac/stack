import { type PolymorphicComponent, ThemedInner } from '@marbemac/ui-primitives-react';
import type { StyleProps } from '@marbemac/ui-styles';
import { type CustomTheme, generateTheme, type PrebuiltThemeIds } from '@marbemac/ui-theme';
import { hashJson } from '@marbemac/utils-ids';

type ThemedProps = StyleProps & { theme: PrebuiltThemeIds; customTheme?: CustomTheme; children: React.ReactNode };

export const Themed: PolymorphicComponent<'div', ThemedProps> = ({ theme, customTheme, children, ...others }) => {
  const generatedTheme = generateTheme(theme, customTheme);
  const themeHash = hashJson(generatedTheme.css);

  return (
    // @ts-expect-error ignore
    <ThemedInner themeHash={themeHash} generatedTheme={generatedTheme} {...others}>
      {children}
    </ThemedInner>
  );
};
