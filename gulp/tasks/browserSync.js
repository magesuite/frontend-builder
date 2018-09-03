const bs = require('browser-sync').create();
const settings = require('../config/browserSync');

module.exports = function browserSync() {
    bs.init(settings.browserSync);
};
