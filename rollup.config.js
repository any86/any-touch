// import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';


// const pkg = require('./package.json');


export default {
    input: './src/main.ts',
    plugins: [typescript({
        exclude: 'node_modules/**',
        typescript: require('typescript')
    }),

    nodeResolve({
        jsnext: true,
        main: true
    }),

    commonjs({
        // non-CommonJS modules will be ignored, but you can also
        // specifically include/exclude files
        include: 'node_modules/**',  // Default: undefined
    })

    ],
    output: [{
        format: 'cjs',
        file: 'dist/AnyTouch.common.js',
    },
    {
        format: 'es',
        file: 'dist/AnyTouch.es.js',
    },
    {
        format: 'umd',
        name: 'AnyTouch',
        file: 'dist/AnyTouch.umd.js',
    }]
};