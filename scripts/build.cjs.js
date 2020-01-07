const fs = require('fs');
const chalk = require('chalk');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
const { gzipSync } = require('zlib');
const { compress } = require('brotli');

// const pkg = require('../package.json');

async function build() {
    const bundle = await rollup.rollup({
        input: './packages/any-touch/src/index.ts',
        plugins: [
            typescript({
                exclude: 'node_modules/**',
                typescript: require('typescript'),
            }),
            replace({
                __VERSION__: '0.6.0'
            }),
            json(),
        ],
        external: ['any-event'],
    });

    console.log(bundle.watchFiles); // an array of file names this bundle depends on
    const file = `./packages/any-touch/dist/any-touch.esm.js`;
    await bundle.write({
        format: 'es',
        file
    });
    const gzipped = gzipSync(file);
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb';

    const compressed = compress(file)
    const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
    console.log(
        `${chalk.gray(
          chalk.bold(file)
        )} gzip: ${gzippedSize} / compressedSize: ${compressedSize}`
      )
}

build();