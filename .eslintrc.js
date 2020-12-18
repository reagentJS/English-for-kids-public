module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'airbnb-base'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'eol-last': ['error', 'always'],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'no-loop-func': 'off',
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }]
  },
};
