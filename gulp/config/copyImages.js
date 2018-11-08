// @ts-check
const path = require('path');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

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
        imageminPngquant(),
        imageminMozjpeg({ quality: 90, progressive: true }),
        imagemin.gifsicle({ interlaced: true }),
        imagemin.svgo({
            plugins: [{ removeViewBox: false }],
        }),
    ],
};
