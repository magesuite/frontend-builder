// @ts-check
const path = require('path');
const imagemin = require('gulp-imagemin');

const paths = require('../paths');

/**
 *  Configuration for images task.
 */
module.exports = {
    watch: [
        // Images except sprites
        path.join(paths.src, '**/*.{gif,png,jpg,webp,svg,ico}'),
    ],
    src: [
        // Images except sprites
        path.join(paths.src, '**/*.{gif,png,jpg,webp,svg,ico}'),
    ],
    dest: paths.dist,
    /**
     * Configuration for imagemin image minifier.
     * @see https://github.com/sindresorhus/gulp-imagemin#imageminoptions
     */
    imagemin: [
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                { removeViewBox: false },
            ],
        }),
    ],
};
