module.exports = {
  root: true,
  extends: ['@marbemac/eslint-config'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};
