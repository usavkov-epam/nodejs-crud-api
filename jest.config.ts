import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  verbose: true,
  moduleFileExtensions: ['js', 'ts'],
  modulePathIgnorePatterns : [
    '<rootDir>/node_modules/',
  ],
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/__tests__/**/*.test.ts',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  }
};
export default config;
