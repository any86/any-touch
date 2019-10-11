if (process.env.NODE_ENV === 'production') {
    module.exports = require('./v-touch.common.prod.js');
} else {
    module.exports = require('./v-touch.common.dev.js');
}