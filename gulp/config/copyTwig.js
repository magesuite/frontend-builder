const path = require('path');
const paths = require('../paths');

/**
 * Configuration for copying assets that don't need any processing.
 */
module.exports = {
    watch: [path.join(paths.src, '**/*.twig')],

    componentsPath: path.resolve(
        'node_modules/creative-patterns/packages/components'
    ),
    src: path.join(paths.src, '**/*.twig'),
    dest: paths.dist,
};
