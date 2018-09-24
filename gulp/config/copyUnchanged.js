const path = require('path');

const paths = require('../paths');

/**
 * Returns configuration for copying assets that don't need any processing.
 */
module.exports = {
    watch: [
        // Fonts.
        path.join(paths.src, '**/*.{ttf,woff,woff2,eot}'),
        // JSON except data for templates.
        path.join(paths.src, '**/*.json'),
        // PHP files
        path.join(paths.src, '**/*.{php,phtml}'),
        // XML files
        path.join(paths.src, '**/*.xml'),
        // CSV files
        path.join(paths.src, '**/*.csv'),
        // Require.js configs.
        path.join(paths.src, '**/*.js'),
        // Less and CSS styles.
        path.join(paths.src, '**/*.{less,css}'),
        // Video media files
        path.join(paths.src, '**/*.{webm,mp4,ogg}'),
    ],

    src: [
        // Fonts.
        path.join(paths.src, '**/*.{ttf,woff,woff2,eot}'),
        // JSON.
        path.join(paths.src, '**/*.json'),
        // PHP files
        path.join(paths.src, '**/*.{php,phtml}'),
        // XML files
        path.join(paths.src, '**/*.xml'),
        // CSV files
        path.join(paths.src, '**/*.csv'),
        // Require.js configs.
        path.join(paths.src, '**/*.js'),
        // Less styles.
        path.join(paths.src, '**/*.{less,css}'),
        // Video media files
        path.join(paths.src, '**/*.{webm,mp4,ogg}'),
    ],
    dest: paths.dist,
};
