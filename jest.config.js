module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['./dist'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
};
