// const path = require('path');
module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ?
    './' : '/',
}