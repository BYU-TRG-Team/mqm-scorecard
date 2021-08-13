module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/prop-types': 'off',
    'max-len': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-plusplus': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/alt-text': 'off',
    'react/jsx-boolean-value': 'off',
    'no-shadow': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'react/no-unescaped-entities': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'import/no-extraneous-dependencies': 'off',
    eqeqeq: 'off',
    'no-useless-escape': 'off',
    quotes: 'off',
    'comma-spacing': 'off',
    'ble quotes': 'off',
    'comma-dangle': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-unused-expressions': 'off',
    'class-methods-use-this': 'off'
  },
};
