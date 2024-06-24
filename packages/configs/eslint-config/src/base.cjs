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
    '*.d.ts',
  ],

  extends: ['eslint:recommended'],

  plugins: ['simple-import-sort', 'import'],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  env: {
    browser: true,
    es6: true,
  },

  settings: {
    tailwindcss: {
      callees: ['tx'],
      tags: ['tw'],
      classRegex: '^(inactiveClassName|activeClassName|className)$',
      whitelist: ['ui\\-[\\w]+'], // any custom classes must be prefixed with `ui-` to clearly call them out
      config: require.resolve('@marbemac/ui-styles/default-tailwind-config'),
    },
  },

  rules: {
    'sort-imports': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/extensions': ['error', 'ignorePackages'],
    'no-return-await': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
  },

  overrides: [
    // Typescript
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
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
        // 'import/extensions': ['error', 'always', { ignorePackages: true }],
      },
    },

    // Markdown (NOTE, causing issues atm, so commented out for now - check back later)
    // {
    //   files: ['**/*.md'],
    //   plugins: ['markdown'],
    //   extends: ['plugin:markdown/recommended', 'prettier'],
    // },

    // Jest/Vitest
    {
      files: ['**/*.(test|spec).{js,jsx,ts,tsx}'],
      plugins: ['vitest'],
      extends: ['plugin:vitest/recommended', 'prettier'],
    },

    // Node
    {
      files: ['.eslintrc.cjs'],
      env: {
        node: true,
      },
    },
  ],
};

module.exports = config;
