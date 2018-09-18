const path = require('path');
const paths = require('../paths');

/**
 * Configuration for copying templates files.
 */
module.exports = {
    watch: [path.join(paths.src, '**/*.html')],
    src: [path.join(paths.src, '**/*.html')],
    dest: paths.dist,
};
