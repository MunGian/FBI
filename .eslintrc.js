module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react/no-unknown-property': ['error', { ignore: ['className'] }]
  }
};
