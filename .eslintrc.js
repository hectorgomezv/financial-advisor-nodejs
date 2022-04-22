module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['jest'],
  rules: {
    'no-underscore-dangle': ['off', 'never'],
    'arrow-parens': ['error', 'as-needed'],
  },
};
