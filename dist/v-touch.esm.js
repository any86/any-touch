if (process.env.NODE_ENV === 'production') {
    module.exports = require('./v-touch.esm.prod.js');
} else {
    module.exports = require('./v-touch.esm.dev.js');
}