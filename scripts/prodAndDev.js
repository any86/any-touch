const IS_PROD = 'production' === process.env.NODE_ENV;
const IS_DEV = 'development' === process.env.NODE_ENV;
const DIST_DIR = 'dist';
/**
 * 生成索引文件
 * @param {String} 名称 
 * @param {String} 格式 
 */

function generateIndex(name) {
    const tpl = `if (process.env.NODE_ENV === 'production') {
    module.exports = require('./${name}.common.prod.js');
} else {
    module.exports = require('./${name}.common.dev.js');
}`;

    fs.writeFileSync(`dist/${name}.common.js`, tpl, 'utf8');
}