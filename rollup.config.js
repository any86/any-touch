import babel from 'rollup-plugin-babel';
export default {
    input: 'esm/main.js',
    plugins: [babel({
        exclude: 'node_modules/**'
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