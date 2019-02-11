// import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';
const banner =
`/*!
 * AnyTouch.js v${pkg.version}
 * (c) 2018-${new Date().getFullYear()} Russell
 * https://github.com/383514580/any-touch
 * Released under the MIT License.
 */`

export default {
    input: './src/main.ts',
    plugins: [
        replace({
            __VERSION__: pkg.version
        }),

        typescript({
            exclude: 'node_modules/**',
            typescript: require('typescript'),

        }),
        json(),
        nodeResolve({
            jsnext: true,
            main: true
        }),

        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: 'node_modules/**', // Default: undefined
        })

    ],
    output: [{
            format: 'cjs',
            file: pkg.main,
            banner
        },
        {
            format: 'es',
            file: pkg.module,
            banner
        },
        {
            format: 'umd',
            name: 'AnyTouch',
            file: pkg.browser,
            banner
        }
    ]
};