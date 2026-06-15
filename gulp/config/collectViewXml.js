import path from 'path';

import paths from '../paths.js';
import parentAliases from '../parentAliases.js';

/**
 * Configuration for collecting view.xml files.
 */
export default {
    src: [
        path.resolve('../../magento/theme-frontend-blank'),
        path.resolve('../magesuite-content-constructor-frontend'),
        ...Object.values(parentAliases()).reverse(),
        paths.src,
    ].map((filePath) => path.join(filePath, 'etc/view.xml')),
    dest: paths.dist,
};
