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
    collectCoverageFrom: [
        'packages/*/src/**/*.ts'],
    verbose: false,
    testPathIgnorePatterns: ["<rootDir>/node_modules/","<rootDir>/packages/simulator/","<rootDir>/packages/vue3/"],
    coveragePathIgnorePatterns: ["<rootDir>/node_modules/","<rootDir>/packages/simulator/","<rootDir>/packages/vue3/"],
    globals: {
        __TEST__: true,
        __VERSION__: require('./package.json').version,
        ontouchstart: null
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    moduleNameMapper: {
        '^@any-touch/(.*?)$': '<rootDir>/packages/$1/src',
        '^@testUtils$': '<rootDir>/testUtils/index.ts',
        '^any-touch$': '<rootDir>/packages/any-touch/src',
        '^any-event$': '<rootDir>/packages/any-event/src'
    },
};