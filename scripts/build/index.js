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
    version
} = require('../../lerna.json');
const walkPackageDirs = require('./walkPackageDirs');

module.exports = {
    walkPackageDirs,
    build: async function ({
        input,
        output,
        tsConfig,
        terser,
        external
    } = {}) {
        const bundle = await rollup.rollup({
            input,

            plugins: [
                typescript({
                    exclude: 'node_modules/**',
                    typescript: require('typescript'),
                    ...tsConfig,
                }),

                replace({
                    preventAssignment:true,
                    __VERSION__: version,
                    // 计算函数的id
                    // __ComputeAngle__: 'a',
                }),

                json(),
                terser,
            ],
            external,
        });
        // console.log(bundle.watchFiles); // an array of file names this bundle depends on
        await bundle.write(output);
        const {
            file
        } = output;
        const code = fs.readFileSync(file);
        // 计算压缩后大小
        const minSize = (code.length / 1024).toFixed(2)
        const gzipped = gzipSync(code);
        const gzippedSize = (gzipped.length / 1024).toFixed(2);

        const compressed = compress(code)
        const compressedSize = (compressed.length / 1024).toFixed(2)

        console.log(
            `${chalk.green(
                chalk.bold(file)
            )} mini: ${minSize}kb / gzip: ${gzippedSize}kb / compressedSize: ${compressedSize}kb`
        )
    }
}