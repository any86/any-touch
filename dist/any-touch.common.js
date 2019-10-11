if (process.env.NODE_ENV === 'production') {
    module.exports = require('./any-touch.common.prod.js');
} else {
    module.exports = require('./any-touch.common.dev.js');
}