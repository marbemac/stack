# @marbemac/ui-styles

- Shared styles and component props.
- Tailwind preset/plugin.

Not all tailwind core plugins are enabled. If you need a utility that is not showing up in autocomplete, etc, chances
are the relevant core plugin is disabled. Simply uncomment it in `src/tailwind/preset.ts``.

## Setup

Your `tailwind.config.ts` file:

```ts
import path from 'node:path';

import { preset } from '@marbemac/ui-styles/tailwind';
import type { Config } from 'tailwindcss';

export default {
  presets: [
    preset(
      // All of these options are optional, preset() is valid on it's own
      {
        // By default, light and dark theme variables are added. Pass false to disable this altogether
        theme: false,

        // OR customize it further
        theme: {
          // Assign the default to another prebuilt or custom theme
          default: 'one_light',

          // You can also override the default dark theme with another prebuilt, or custom theme (false to not include it at all)
          dark: {
            name: 'my_dark',
            colors: {
              /** custom theme colors */
            },
          },

          // additional themes are accessible via the `[data-theme="${theme.name}"]` attribute in your HTML
          additional: [
            'dracula',
            {
              name: 'my_custom_theme',
              colors: {
                /** custom theme colors */
              },
            },
          ],
        },
      },
    ),
  ],

  content: [
    'src/**/*.{ts,tsx}',

    // If you are using @marbemac/primitives, you must include the ui-styles files so that the appropriate
    // classes are identified by tailwind
    path.join(path.dirname(require.resolve('@marbemac/ui-styles')), '**/*.ts'),
  ],
} satisfies Config;
```
