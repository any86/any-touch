// 为了让rollup识别commonjs类型的包,默认只支持导入ES6
import commonjs from 'rollup-plugin-commonjs';
// 为了支持import xx from 'xxx'
import nodeResolve from 'rollup-plugin-node-resolve';
// ts转js的编译器
import typescript from 'rollup-plugin-typescript';
// 支持加载json文件
import json from 'rollup-plugin-json';
// 支持字符串替换, 比如动态读取package.json的version到代码
import replace from 'rollup-plugin-replace';
// 读取package.json
import pkg from '../package.json';
// 压缩代码
const {
    terser
} = require('rollup-plugin-terser');

// 插件
export const plugins = [
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
        include: 'node_modules/**'
    }),

    // 压缩
    terser({
        include: [/^.+\.(?:min|prod)\.js$/],
    }),

    // sourceMaps()
];