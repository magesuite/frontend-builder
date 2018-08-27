const path = require('path');

const paths = require('../../paths');

/**
 * Returns configuration for copying script files that don't need any processing.
 */
module.exports = {
    watch: [
        path.join(paths.src, '**/*.js'),
        '!' + path.join(paths.src, 'vendors/**/*.js'),
    ],
    src: [
        path.join(paths.src, '**/*.js'),
        '!' + path.join(paths.src, 'vendors/**/*.js'),
    ],
    // Uglify settings.
    // @see https://www.npmjs.com/package/gulp-uglify#options
    uglify: {},
    dest: paths.dist,
};
