const log = require('fancy-log');
const del = require('del');
const settings = require('../config/clean');

module.exports = function clean() {
    return del(settings.src, {
        force: true,
    }).catch(error => log.error(error.message));
};
