const fs = require('fs');
const chalk = require('chalk');
const {
    terser
} = require('rollup-plugin-terser');
const {
    build,
    walkPackageDirs
} = require('./build');
const writeProdAndDevEntry = require('./build/writeProdAndDevEntry');


console.log(chalk.blue(`正在生成cjs模块!`));

const genRollupConfig = (dirName, env = 'dev') => ({
    input: `./packages/${dirName}/src/index.ts`,
    output: {
        file: `./packages/${dirName}/dist/index.${env}.js`,
        format: 'cjs',
        exports: "named"
    },
    external: id => ['any-event', 'any-touch', 'tslib'].includes(id) || /^@/.test(id),
    tsConfig: {
        target: 'ES5'
    },
    terser: terser({
        include: [/^.+\.prod\.js$/],
        output: {
            comments: false
        }
    })
});


walkPackageDirs((dirName) => {
    fs.mkdirSync(`./packages/${dirName}/dist`,{recursive:true});
    build(genRollupConfig(dirName, 'dev'));
    build(genRollupConfig(dirName, 'prod'));
    fs.writeFileSync(`./packages/${dirName}/dist/index.js`, writeProdAndDevEntry(), 'utf8');
});