const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
const {
    gzipSync
} = require('zlib');
const {
    compress
} = require('brotli');
const {
    terser
} = require('rollup-plugin-terser');
const {version} = require('../package.json');

console.log(chalk.blue('正在生成es模块!'))
packAllInOne(['any-event', 'any-touch', 'Tap', 'Pan', 'Swipe', 'Press', 'Pinch', 'Rotate',`shared`, 'compute', 'Recognizer', 'vector']);

async function build(input, output) {
    const bundle = await rollup.rollup({
        input,
        plugins: [
            typescript({
                exclude: 'node_modules/**',
                typescript: require('typescript'),
                target: "ES5",
                module: "ESNEXT",
            }),

            replace({
                __VERSION__: version
            }),
            json(),
            // terser(),
        ],
        external: id => ['any-event', 'any-touch', 'tslib'].includes(id) || /^@/.test(id),
    });
    // console.log(bundle.watchFiles); // an array of file names this bundle depends on
    const file = output;
    await bundle.write({
        format: 'es',
        file
    });

    // 计算压缩后大小
    const minSize = (file.length / 1024).toFixed(2)
    const gzipped = gzipSync(file);
    const gzippedSize = (gzipped.length / 1024).toFixed(2);

    const compressed = compress(file)
    const compressedSize = (compressed.length / 1024).toFixed(2)

    console.log(
        `${chalk.green(
            chalk.bold(file)
        )} mini: ${minSize}kb / gzip: ${gzippedSize}kb / compressedSize: ${compressedSize}kb`
    )
}
/**
 * 注意并不遍历src下的文件夹
 * 打包js到包的跟目录
 * 生成更小力度的js
 *@param {String} ts文件夹
 */
function packSeparate(names) {
    for (const name of names) {
        const dir = `./packages/${name}/src/`
        const fileNames = fs.readdirSync(dir);
        const tsFileName = fileNames.filter(fileName => /\.ts$/.test(fileName));
        for (const name of tsFileName) {
            const dest = path.resolve(dir, '../', `${name.replace(/\.ts$/, '')}.mjs`);
            build(`${dir}${name}`, dest);
        }
    }
}

/**
 * 注意并不遍历src下的文件夹
 * 打包到各自的dist文件夹
 * @param {String[]} dirs 
 */
function packAllInOne(dirs) {
    for (const dir of dirs) {
        build(`./packages/${dir}/src/index.ts`, `./packages/${dir}/dist/index.mjs`);
    }
}