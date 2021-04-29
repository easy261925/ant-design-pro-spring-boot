module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-useless-return': 0,
    'no-else-return': 0,
    'no-restricted-syntax': 0,
    'prefer-promise-reject-errors': 0,
    'react-hooks/rules-of-hooks': 0,
    'import/no-duplicates': 0,
    'import/no-unresolved': 0,
    'react/self-closing-comp': 0,
  },
};
