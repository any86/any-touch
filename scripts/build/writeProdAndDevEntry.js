// const IS_PROD = 'production' === process.env.NODE_ENV;
// const IS_DEV = 'development' === process.env.NODE_ENV;
/**
 * 生成commonjs入口文件
 * @param {String} 文件名称 
 */
module.exports = function(name = 'index') {
    return `if(void 0 === process){require('./${name}.prod.js');} else {if (process.env.NODE_ENV === 'development') {module.exports = require('./${name}.dev.js');} else {module.exports = require('./${name}.prod.js');}}`;
}