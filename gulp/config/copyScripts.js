// @ts-check
const path = require('path');

const paths = require('../paths');

/**
 *  Configuration for scripts task.
 */
module.exports = {
    watch: [path.join(paths.src, 'web/js/**/*.js')],
    src: [path.join(paths.src, 'web/js/**/*.js')],
    dest: path.join(paths.dist, 'web/js'),
};
