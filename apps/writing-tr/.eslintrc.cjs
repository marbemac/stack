module.exports = {
  root: true,
  extends: ['plugin:tailwindcss/recommended', '@marbemac/eslint-config'],
  settings: {
    tailwindcss: {
      callees: ['tw'],
      classRegex: '^tw$',
      config: require.resolve('@marbemac/ui-styles/tailwind-config'),
    },
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};
