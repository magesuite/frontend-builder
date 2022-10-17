// @ts-check
const path = require('path');
const paths = require('../paths');

/**
 *  Configuration for documentation copy task.
 */
module.exports = {
    watch: [
        // Images except sprites
        path.join(paths.src, 'doc/**/*.{md,gif,png,jpg,webp,svg,ico}'),
    ],
    src: [
        // Images except sprites
        path.join(paths.src, 'doc/**/*.{md,gif,png,jpg,webp,svg,ico}'),
    ],
    dest: path.join(paths.dist, 'doc/'),
};
