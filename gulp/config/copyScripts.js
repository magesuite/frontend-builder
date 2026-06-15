// @ts-check
import path from 'path';

import paths from '../paths.js';

/**
 *  Configuration for scripts task.
 */
export default {
    watch: [path.join(paths.src, 'web/js/**/*.js')],
    src: [path.join(paths.src, 'web/js/**/*.js')],
    dest: path.join(paths.dist, 'web/js'),
};
