const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
import {version} from './packages/any-touch/package.json';
import { defineConfig } from 'rollup';
export default defineConfig({
    input: './packages/any-touch/src/index.ts',

    plugins: [
        typescript({
            exclude: 'node_modules/**',
            typescript: require('typescript'),
        }),
        json(),
        replace({
            preventAssignment:true,
            __VERSION__: version
        })
    ],

    output: [{
        format: 'umd',
        name: 'AnyTouch',
        file: `./packages/any-touch/dist/any-touch.umd.js`,
        sourcemap: false,
    }]
});