const browserSync = require('browser-sync').create();
const settings = require('../config/browserSync');

module.exports = function browserSync() {
    browserSync.init(settings.browserSync);
};
