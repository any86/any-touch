// import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
export default {
    input: 'src/main.ts',
    // plugins: [ babel({ exclude: 'node_modules/**' }) ],
    plugins: [typescript(

    )],
    output: [{
        format: 'es',
        file: 'dist/anyTouch.es.js',
    }, {
        format: 'umd',
        name: 'AnyTouch',
        file: 'dist/anyTouch.umd.js',
    }]
};