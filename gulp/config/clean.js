import path from 'path';

import paths from '../paths.js';

/**
 * Cleaning task settings.
 */
export default {
    /**
     * Paths that should be deleted.
     */
    src: [path.join(paths.dist, '**/*')],
};
