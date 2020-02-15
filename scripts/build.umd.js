const chalk = require('chalk');
const parseArgs = require('minimist')
const {
    terser
} = require('rollup-plugin-terser');
const {
    build
} = require('./build');
const {compress} = require('minimist')(process.argv.slice(2));

console.log(chalk.blue(`🤖 正在${compress?'压缩':'生成'}umd模块!`));

const options = {
    input: `./packages/any-touch/src/UMD.ts`,
    output: {
        file: `./packages/any-touch/dist/any-touch.umd.js`,
        format: 'umd',
        name: 'AnyTouch',
    },
    tsConfig: {
        target: "ES5",
    },
    terser: terser({
        include: [/^.+\.min\.js$/],
        output: {
            comments: false
        }
    })
}
if(compress){
    options.output.file =options.output.file.replace('.js', '.min.js');
}
build(options);