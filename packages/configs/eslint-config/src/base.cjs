/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  ignorePatterns: [
    '.github',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.yalc',
    '.yarn',
    '.cache',
    '.storybook/*',
    'build',
    'dist',
    'node_modules',
    '*.mjs',
    'next.config.js',
    'tailwind-config.ts',
    'tailwind.config.js',
    'postcss.config.js',
  ],

  parser: '@typescript-eslint/parser',

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],

  plugins: ['@typescript-eslint', 'simple-import-sort', 'import'],

  env: {
    es6: true,
  },

  settings: {
    tailwindcss: {
      callees: ['tw', 'tx'],
      classRegex: '^(tw|twInactive|twActive)$',
      config: require.resolve('@marbemac/ui-styles/tailwind-config'),
    },
  },

  rules: {
    'sort-imports': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/extensions': ['error', 'ignorePackages'],
    'no-return-await': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          // un-ban a type that's banned by default
          Function: false,
          '{}': false,
        },
      },
    ],
  },
};

module.exports = config;
