// @ts-check
import path from 'path';

import paths from '../paths.js';

/**
 *  Configuration for images task.
 */
export default {
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
     * Options passed to imagemin plugins in production builds.
     */
    mozjpeg: { quality: 90, progressive: true, chromaSubsampling: '4:4:4' },
    pngquant: {},
    svgo: {
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        removeViewBox: false,
                    },
                },
            },
        ],
    },
};
