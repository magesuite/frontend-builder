// @ts-check

const path = require('path');
const paths = require('../paths');

/**
 * Settings for SVG sprites.
 */
module.exports = {
    watch: [path.join(paths.src, 'sprites/svg/*.svg')],
    src: path.join(paths.src, 'sprites/svg/*.svg'),
    dest: path.join(paths.dist, 'web/images/'),
    /**
     * Gulp-svg-sprite configuration.
     * @see https://github.com/jkphl/gulp-svg-sprite#api
     */
    svgSprite: {
        mode: {
            css: false,
            view: false,
            defs: {
                dest: '',
                sprite: 'sprites.svg',
            },
            symbol: false,
            stack: false,
        },
    },
};
