module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'game-utils.js',
        'tests/**/*.js',
        '!tests/**/*.test.js'
    ],
    coverageReporters: ['text', 'lcov'],
    testMatch: [
        '**/tests/**/*.test.js'
    ]
};