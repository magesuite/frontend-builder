const del = require('del');
const settings = require('../../config/maintain/clean');

module.exports = function() {
    return del(settings.src, {
        force: true,
    });
};
