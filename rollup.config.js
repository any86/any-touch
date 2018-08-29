// import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';
export default {
  input: 'src/main.ts',
  // plugins: [ babel({ exclude: 'node_modules/**' }) ],
  plugins: [typescript()],
  output: [{
    format: 'es',
    file: 'dist/touch2.es.js',
  },{
    format: 'umd',
    name: 'AnyTouch',
    file: 'dist/touch2.umd.js',
  }]
};