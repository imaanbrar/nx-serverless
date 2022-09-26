module.exports = {
  displayName: 'audit',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  coverageDirectory: '../../coverage/services/audit',
};
