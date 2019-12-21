// ts转js的编译器
import typescript from 'rollup-plugin-typescript2';
// 支持加载json文件
import json from '@rollup/plugin-json';
// 支持字符串替换, 比如动态读取package.json的version到代码
import replace from '@rollup/plugin-replace';
// 读取package.json
import pkg from './package.json';
// 压缩代码
// const {
//     terser
// } = require('rollup-plugin-terser');

// console.log(typescript)
// 插件
export const plugins = [
    typescript({
        exclude: 'node_modules/**',
        typescript: require('typescript'),

    }),

    replace({
        __VERSION__: pkg.version
    }),

    json(),


    // 压缩
    // terser({
    //     include: [/^.+\.(?:min|prod)\.js$/],
    // }),

    // sourceMaps()
];