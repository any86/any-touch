// 为了让rollup识别commonjs类型的包,默认只支持导入ES6
const commonjs = require('rollup-plugin-commonjs');
// 为了支持import xx from 'xxx'
const nodeResolve = require('rollup-plugin-node-resolve');
// ts转js的编译器
const typescript = require('rollup-plugin-typescript');
// 支持加载json文件
const json = require('rollup-plugin-json');
// 支持字符串替换, 比如动态读取package.json的version到代码
const replace = require('rollup-plugin-replace');
// 读取package.json
const pkg = require('../package.json');
// 压缩代码
const {
    terser
} = require('rollup-plugin-terser');
// 代码生成sourcemaps
const sourceMaps = require('rollup-plugin-sourcemaps');



// 代码头
const banner =
    `/*!
 * AnyTouch.js v${pkg.version}
 * (c) 2018-${new Date().getFullYear()} Russell
 * https://github.com/any86/any-touch
 * Released under the MIT License.
 */`

module.exports = {
    output: [{
            format: 'cjs',
            // 生成的文件名和路径
            // package.json的main字段, 也就是模块的入口文件
            file: pkg.main,
            banner,
            sourcemap: true
        },
        {
            format: 'es',
            // rollup和webpack识别的入口文件, 如果没有该字段, 那么会去读取main字段
            file: pkg.module,
            banner,
            sourcemap: true
        },
        {
            format: 'umd',
            name: 'AnyTouch',
            file: pkg.browser,
            banner,
            sourcemap: true
        }
    ],
    input: './src/main.ts',

    plugins: [
        replace({
            __VERSION__: pkg.version,
        }),

        nodeResolve(),

        commonjs({
            include: 'node_modules/**'
        }),

        json(),

        typescript({
            // exclude: 'node_modules/**',
            typescript: require('typescript'),
        }),


        // terser(),

        sourceMaps(),

    ]
};