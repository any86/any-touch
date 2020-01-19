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
// const pkg = require('../package.json');

console.log(chalk.blue('正在生成cjs模块!'))
const PACKAGES_DIR = `packages`
const pkgNames = fs.readdirSync(PACKAGES_DIR);
for (const pkgName of pkgNames) {
    const path = `${PACKAGES_DIR}/${pkgName}`;
    const stats = fs.statSync(path);
    // 文件夹
    if (stats.isDirectory()) {
        build(`./packages/${pkgName}/src/index.ts`, `./packages/${pkgName}/dist/index.es.js`);
    }
}

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
                __VERSION__: '0.6.0'
            }),
            json(),
            // terser(),
        ],
        external: id => ['any-event', 'any-touch', 'tslib'].includes(id) || /^@any-touch/.test(id),
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