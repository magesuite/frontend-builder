const path = require('path');
const paths = require('../../paths');

/**
 * Configuration for vendor JS files compilation task.
 */
module.exports = {
    watch: [
        path.join(paths.src, 'vendors/**/*.js'),
        '!' + path.join(paths.src, 'vendors/**/_*.js'),
    ],
    src: [
        path.join(paths.src, 'vendors/**/*.js'),
        '!' + path.join(paths.src, 'vendors/**/_*.js'),
    ],
    // Uglify settings.
    // @see https://www.npmjs.com/package/gulp-uglify#options
    uglify: {},
    dest: path.join(paths.dist, 'web/'),
};