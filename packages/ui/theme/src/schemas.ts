import { object, optional, partial, string } from 'valibot';

export const themeConfigSchema = object({
  baseThemeId: string(),
  customTheme: optional(
    partial(
      object({
        name: string(),
        colors: partial(
          object({
            text: string(),
            background: string(),
            primary: string(),
            danger: string(),
          }),
        ),
      }),
    ),
  ),
});
