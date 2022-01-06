const chalk = require('chalk');
const parseArgs = require('minimist')
const {
    terser
} = require('rollup-plugin-terser');
const {
    build
} = require('./build');
const { compress } = require('minimist')(process.argv.slice(2));

console.log(chalk.blue(`🤖 正在${compress ? '压缩' : '生成'}umd模块!`));

const options = {
    input: `./packages/any-touch/src/index.ts`,
    output: {
        file: `./packages/any-touch/dist/any-touch.umd.js`,
        format: 'umd',
        name: 'AnyTouch',
        sourcemap: true
    },
    tsConfig: {
        target: "ES5",
    },

}
if (compress) {
    options.output.file = options.output.file.replace('.js', '.min.js');
    options.terser = terser({
        output: {
            comments: false
        }
    })
}
build(options);