module.exports = {
    preset: 'ts-jest/presets/js-with-babel',
    testEnvironment: 'jsdom',
    // roots: ['./src/'],
    // testEnvironment: 'jest-environment-jsdom-global',
    testEnvironmentOptions: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    },
    collectCoverage: true,
    coverageDirectory: "./coverage/",
    verbose: false,
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/__tests__/utils/"],
    coveragePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/__tests__/utils/"],
    globals: {
        __TEST__: true,
        ontouchstart: null
    }
};