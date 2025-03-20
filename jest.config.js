export default {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  extensionsToTreatAsEsm: ['.jsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/client/main.jsx',
    '!src/server/index.js'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom'
  ]
};