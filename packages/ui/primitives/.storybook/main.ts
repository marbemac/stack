import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',

      // disable the addons we don't use or that are broken
      options: {
        // actions: false,
        // backgrounds: false,
        // controls: false,
        docs: false, // breaks the form stories
        // viewport: false,
        // toolbars: false,
        measure: false,
        // outline: false,
        highlight: false,
      },
    },
    '@storybook/addon-a11y',
    'storybook-addon-performance',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
