const rollup = require('rollup');
const config = require('./rollup.config');
// 压缩代码
const {
    terser
} = require('rollup-plugin-terser');
const {
    input,
    plugins,
    output
} = config;


// 非压缩
output.forEach(eachOutputOptions=>{
    build(eachOutputOptions);
});

// 压缩
// output.forEach(eachOutputOptions=>{
//     plugins.push(terser());
//     // 修改文件名
//     eachOutputOptions.file = eachOutputOptions.file.replace('.js', '.min.js');
//     build(eachOutputOptions);
// });


// 打包开始
async function build(outputOptions) {
    const bundle = await rollup.rollup({
        input,
        plugins
    });

    // console.log(bundle.imports); // an array of external dependencies
    // console.log(bundle.exports); // an array of names exported by the entry point
    // console.log(bundle.modules); // an array of module objects
    const {
        code,
        map
    } = await bundle.generate(outputOptions);

    await bundle.write(outputOptions);
}