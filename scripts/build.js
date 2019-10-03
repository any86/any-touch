const rollup = require('rollup');
const config = require('./rollup.build.config');
const vueDirectiveConfig = require('./rollup.build.vue.directive.config');

// 打包AnyTouch各个版本
config.output.forEach(output => {
    const external = 'umd' === output.format ? undefined : ['any-event'];
    build({ ...config, external }, output);
});

// 打包vue指令插件各个版本
vueDirectiveConfig.output.forEach(output => {
    // const external = 'umd' === output.format ? undefined : ['any-event', '../AnyTouch'];
    const external = (id) => {
        return '../AnyTouch' === id;
        // return /^babel/.test(id)
    };

    build({ ...vueDirectiveConfig, external }, output);
});


// 打包指定版本的AnyTouch
async function build(config, output) {
    const bundle = await rollup.rollup(config);
    // console.log(bundle.imports); // an array of external dependencies
    // console.log(bundle.exports); // an array of names exported by the entry point
    // console.log(bundle.modules); // an array of module objects
    // const {
    //     code,
    //     map
    // } = await bundle.generate(output);

    await bundle.write(output);
    // const code = fs.readFileSync('dist/vTouch.esm.js', 'utf8');
}



