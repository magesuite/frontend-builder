const path = require('path');

const paths = require('../paths');

/**
 * Cleaning task settings.
 */
module.exports = {
    /**
     * Paths that should be deleted.
     */
    src: [path.join(paths.dist, '**/*'), path.join(paths.src, '.cache-loader')],
};
