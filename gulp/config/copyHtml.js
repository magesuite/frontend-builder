import path from 'path';

import paths from '../paths.js';

/**
 * Configuration for copying templates files.
 */
export default {
    watch: [path.join(paths.src, '**/*.html')],
    src: [path.join(paths.src, '**/*.html')],
    dest: paths.dist,
};
