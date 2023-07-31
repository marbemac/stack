import * as React from 'react';
import { PREBUILT_THEMES } from '@marbemac/ui-theme';
import type { Decorator, Preview } from '@storybook/react';
import { createStylePropsResolver, createTwind } from '@marbemac/ui-twind';

// @ts-expect-error bah
import { PrimitivesProvider, Themed } from '../src/index.ts';

const twind = createTwind();

const withTheme: Decorator = (Story, context) => {
  const themeId = context.globals.themeId;

  return (
    <PrimitivesProvider stylePropResolver={createStylePropsResolver(twind)}>
      <Themed
        // force unmount/remount for purposes of storybook
        key={themeId}
        defaultThemeId={themeId}
        tw="absolute inset-0 overflow-auto flex items-center justify-center font-ui"
      >
        <Story />
      </Themed>
    </PrimitivesProvider>
  );
};

const themeItems: any = [];
for (const [themeId, theme] of Object.entries(PREBUILT_THEMES)) {
  themeItems.push({ value: themeId, title: theme.name });
}

const preview: Preview = {
  decorators: [withTheme],

  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  globalTypes: {
    themeId: {
      name: 'Theme',
      defaultValue: 'default',
      toolbar: {
        icon: 'circlehollow',
        items: themeItems,
        showName: true,

        // Change title based on selected value
        dynamicTitle: true,
      },
    },
  },

  // @ts-expect-error ignore
  a11y: {
    config: {
      // optional selector which element to inspect
      element: '#root',
      // axe-core configurationOptions (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1)
      config: {},
      // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
      options: {},
      // optional flag to prevent the automatic check
      manual: true,
    },
  },
};

export default preview;
