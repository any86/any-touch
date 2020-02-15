// const path = require('path');
module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ?
    './' : '/',
  // configureWebpack: {
  //   resolve: {
  //     // 设置别名
  //     alias: {
  //       '@any-touch/core': path.resolve('../packages/core/dist'),
  //     }
  //   }
  // }
}