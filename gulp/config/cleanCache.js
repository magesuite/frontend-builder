import path from 'path';

import paths from '../paths.js';

/**
 * Configuration for the Magento cache-clearing task.
 * Defines which cache types to flush and the connection method used to run
 * bin/magento cache:clean — supports ssh, local, and docker connection types.
 */
export default {
    cacheTypes: ['layout', 'block_html', 'full_page'],

    /**
     * magentoConnection: {
     *   type: 'ssh',
     *   host: string,
     *   username: string,
     *   privateKey: string,
     *   path: string
     * } | {
     *   type: 'local',
     *   path: string
     * } | {
     *   type: 'docker',
     *   container: string,
     *   path: string
     * }
     */
    magentoConnection: {
        type: 'docker',
        container: 'docker-php-1',
        path: '/var/www/projects/' + path.basename(path.resolve('../../../')),
    },

    watch: [
        // Template files
        path.join(paths.dist, '**/*.{php,phtml,html,twig}'),
        // XML files
        path.join(paths.dist, '**/*.xml'),
        // CSV files
        path.join(paths.dist, '**/*.csv'),
    ],
};
