const path = require('path');

const paths = require('../paths');

/**
 * Returns configuration for copying assets that don't need any processing.
 */
module.exports = {
    cacheTypes: ['layout', 'block_html', 'full_page'],
    watch: [
        // Template files
        path.join(paths.dist, '**/*.{php,phtml,html,twig}'),
        // XML files
        path.join(paths.dist, '**/*.xml'),
        // CSV files
        path.join(paths.dist, '**/*.csv'),
    ],
};
