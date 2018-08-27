const browserSync = require('browser-sync');
const settings = require('../../config/maintain/serve');

module.exports = function() {
    browserSync.init(settings.browserSync);
};
