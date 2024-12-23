import '../src/tailwind.css';

import * as React from 'react';
import { PREBUILT_THEMES } from '@marbemac/ui-theme';
import type { Decorator, Preview } from '@storybook/react';
// import { withPerformance } from 'storybook-addon-performance'; // doesn't work with storybook 8 yet
import { generateTheme } from '@marbemac/ui-theme';

import { ThemedGlobalInner } from '../src/components/Themed/themed-global-inner.tsx';

const withTheme: Decorator = (Story, context) => {
  const themeId = context.globals.themeId;
  const generatedTheme = generateTheme(themeId);

  return (
    <ThemedGlobalInner
      // force unmount/remount for purposes of storybook
      key={themeId}
      generatedTheme={generatedTheme}
    >
      <Story />
    </ThemedGlobalInner>
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
