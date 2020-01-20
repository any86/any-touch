const chalk = require('chalk');
const {
    terser
} = require('rollup-plugin-terser');
const {
    build
} = require('./build');

console.log(chalk.blue('🤖 正在生成umd模块!'));

build({
    input: `./packages/any-touch/src/index.ts`,
    output: {
        file: `./packages/any-touch/dist/any-touch.umd.js`,
        format: 'umd',
        name: 'AnyTouch',
    },
    tsConfig: {
        target: "ES5",
    }
});


build({
    input: `./packages/any-touch/src/index.ts`,
    output: {
        file: `./packages/any-touch/dist/any-touch.umd.min.js`,
        format: 'umd',
        name: 'AnyTouch',
    },
    tsConfig: {
        target: "ES5",
    },
    terser: terser({
        output: {
            comments: false
        }
    })
});