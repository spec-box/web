import { resolve } from 'node:path';
import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest';
import { compilerOptions } from '../../tsconfig.json';

const config: JestConfigWithTsJest = {
  rootDir: resolve(__dirname, '../../'),
  preset: 'ts-jest',
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/tests/**/*.(spec|test).{ts,js}?(x)'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
  setupFilesAfterEnv: ['<rootDir>/.config/jest/setup.ts'],
  reporters: ['default'],
};

export default config;
