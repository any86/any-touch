// import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';
export default {
    input: './src/main.ts',
    plugins: [typescript({
        exclude: 'node_modules/**',
        typescript: require('typescript')
    })],
    output: [{
        format: 'es',
        file: 'dist/anyTouch.es.js',
    }, {
        format: 'umd',
        name: 'AnyTouch',
        file: 'dist/anyTouch.umd.js',
    }]
};