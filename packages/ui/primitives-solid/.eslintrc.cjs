module.exports = {
  root: true,
  extends: ['plugin:tailwindcss/recommended', 'plugin:storybook/recommended', '@marbemac/eslint-config'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};
