module.exports = {
  verbose: true,
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**', '!src/index.ts', '!src/legacy.ts'],
  testPathIgnorePatterns: ['/__ignore_tests__/'],
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
