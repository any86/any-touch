const fs = require('fs');
const chalk = require('chalk');
const {
    gzipSync
} = require('zlib');

function calcSize(fileURL) {
    const file = fs.readFileSync(fileURL)
    const minSize = (file.length / 1024).toFixed(2) + 'kb'
    const gzipped = gzipSync(file)
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'

    console.log(
        `${chalk.gray(
            chalk.bold(fileURL)
        )} min:${minSize} / gzip:${gzippedSize}`
    )
}

calcSize('./dist/any-touch.min.js');