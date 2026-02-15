export default {
    testEnvironment: 'node',
    transform: {},
    verbose: true,
    roots: ['./tests'],
    testMatch: [
        '**/tests/unit/**/*.test.mjs'
    ],
    collectCoverageFrom: [
        'src/**/*.mjs',
        '!src/data/**',
        '!**/node_modules/**'
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html', 'json'],
    clearMocks: true,
    testTimeout: 10000
}
