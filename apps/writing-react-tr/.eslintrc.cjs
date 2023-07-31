module.exports = {
  root: true,
  extends: ['plugin:tailwindcss/recommended', '@marbemac/eslint-config/react'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};
