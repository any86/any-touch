if (process.env.NODE_ENV === 'production') {
    module.exports = require('./any-touch.esm.prod.js');
} else {
    module.exports = require('./any-touch.esm.dev.js');
}