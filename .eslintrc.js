module.exports = {
  root: true,
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        'singleQuote': true,
        'semi': true
      }
    ],
    'class-methods-use-this': 0,
    'no-nested-ternary': 0,
    'no-plusplus': 0,
    'valid-jsdoc': 1,
    // 'import/no-dynamic-require': 0, // We need to read the whole directory many times and require files dynamically
    // 'global-require': 0, // Same as above, 'require' will be inside functions on those cases
    'no-underscore-dangle': 0,
    'curly': ['error', 'all'],
    // 'no-prototype-builtins': 0, // We do use foo.hasOwnProperty('bar') and in our scenarios object prototype is always available
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'no-unused-vars': ["error", { "argsIgnorePattern": "^_" }]
  }
};
