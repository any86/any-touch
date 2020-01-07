const fs = require('fs');
const chalk = require('chalk');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
const { gzipSync } = require('zlib');
const { compress } = require('brotli');
const {
    terser
} = require('rollup-plugin-terser');
// const pkg = require('../package.json');

async function build(input, output) {
    const bundle = await rollup.rollup({
        input,
        plugins: [
            typescript({
                exclude: 'node_modules/**',
                typescript: require('typescript'),
            }),
            replace({
                __VERSION__: '0.6.0'
            }),
            json(),
            terser(),
        ],
        external: id => ['any-event', '@const'].includes(id) || /^@/.test(id),
    });

    // console.log(bundle.watchFiles); // an array of file names this bundle depends on
    const file = output;
    await bundle.write({
        format: 'es',
        file
    });

    // 计算压缩后大小
    const minSize = (file.length / 1024).toFixed(2) + 'kb'
    const gzipped = gzipSync(file);
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb';

    const compressed = compress(file)
    const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
    console.log(
        `${chalk.blue(
            chalk.bold(file)
        )}mini: ${minSize} / gzip: ${gzippedSize} / compressedSize: ${compressedSize}`
    )
}

build('./packages/any-touch/src/index.ts', `./packages/any-touch/dist/any-touch.esm.js`);
build('./packages/Tap/src/index.ts', `./packages/Tap/dist/any-touch.plugin.tap.esm.js`);
build('./packages/Pan/src/index.ts', `./packages/Pan/dist/any-touch.plugin.pan.esm.js`);
build('./packages/Press/src/index.ts', `./packages/Press/dist/any-touch.plugin.press.esm.js`);
build('./packages/Swipe/src/index.ts', `./packages/Swipe/dist/any-touch.plugin.swipe.esm.js`);
build('./packages/Pinch/src/index.ts', `./packages/Pinch/dist/any-touch.plugin.pinch.esm.js`);
build('./packages/Rotate/src/index.ts', `./packages/Rotate/dist/any-touch.plugin.rotate.esm.js`);

