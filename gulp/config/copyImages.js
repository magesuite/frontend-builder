// @ts-check
const path = require('path');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

const imageminPngquant = require('../imageminPngquant');
const imageminSharpJpeg = require('../imageminSharpJpeg');
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
     * Imagemin plugins applied to images in production builds.
     */
    imagemin: [
        imageminPngquant(),
        imageminSharpJpeg({
            quality: 90,
            progressive: true,
            chromaSubsampling: '4:4:4',
        }),
        imageminGifsicle({ interlaced: true }),
        imageminSvgo({
            plugins: [{ removeViewBox: false }],
        }),
    ],
};
