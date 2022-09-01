// const path = require('path');
module.exports = {
  lintOnSave: false,
  // publicPath: process.env.NODE_ENV === 'production' ?
  //   './' : '/',
  configureWebpack: {

    resolve: {

      alias: {
        '@any-touch': '../../../packages',
        'any-event': '../../../packages/any-event/dist/index.js'
      }
    }
  }
}