const strictEslint = require('./common/eslintrc');

module.exports = {
  ...strictEslint,
  rules: {
    ...strictEslint.rules,
    'react/no-unused-prop-types': ['warn'],
    'no-restricted-syntax': ['off'],
    'react/no-did-update-set-state': ['off'],
    'no-script-url': ['off'],
  },
};
