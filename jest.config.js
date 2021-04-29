module.exports = {
  verbose: true,
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**', '!src/index.ts'],
  modulePathIgnorePatterns: ['__ignore_test__'],
  testMatch: ['<rootDir>/tests/*.ts', '<rootDir>/tests/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 98.12,
      functions: 100,
      lines: 100,
    },
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
