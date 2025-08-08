export default {
  testEnvironment: 'node',
  transform: {},
  verbose: true,
  roots: ['./tests'],
  
  // Test file patterns
  testMatch: [
    '**/tests/unit/**/*.test.mjs'
  ],
  
  // Coverage settings
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.mjs',
    '!src/data/**',
    '!**/node_modules/**'
  ],
  
  // Clear mocks between tests
  clearMocks: true
}