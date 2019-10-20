module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '/__tests__/[A-Za-z0-9]+\\.(test|spec)\\.[t]sx?$',
};
