module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  testRegex: '/__tests__/[A-Za-z0-9]+\\.(test|spec)\\.[t]sx?$',
};

