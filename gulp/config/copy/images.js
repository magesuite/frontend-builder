const path = require('path');

const paths = require('../../paths');

/**
 *  Configuration for images task.
 */
module.exports = {
    watch: [
        // Images except sprites
        path.join(paths.src, 'images/**/*.{gif,png,jpg,webp,svg,ico}'),
    ],
    src: [
        // Images except sprites
        path.join(paths.src, 'images/**/*.{gif,png,jpg,webp,svg,ico}'),
    ],
    dest: path.join(paths.dist, 'web/images/'),
    /**
     * Configuration for imagemin image minifier.
     * @see https://github.com/sindresorhus/gulp-imagemin#imageminoptions
     */
    imagemin: {},
};
