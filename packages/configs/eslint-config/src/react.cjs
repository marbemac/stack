/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  root: true,

  extends: [
    '@marbemac/eslint-config/base',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],

  settings: {
    react: {
      linkComponents: [
        // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
        'Hyperlink',
        { name: 'Link', linkAttribute: 'to' },
      ],
    },
  },

  rules: {
    'react/prop-types': 'off',
  },
};

module.exports = config;
