const path = require('path');

const paths = require('../../paths');

/**
 * Returns configuration for copying assets that don't need any processing.
 */
module.exports = {
    watch: [
        // Fonts.
        path.join(paths.src, '**/*.{ttf,woff,woff2,eot}'),
    ],

    src: [
        // Fonts.
        path.join(paths.src, '**/*.{ttf,woff,woff2,eot}'),
    ],
    dest: path.join(paths.dist, 'web/'),
};
