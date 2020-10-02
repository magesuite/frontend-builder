const path = require('path');
const paths = require('../paths');
const parentAliases = require('../parentAliases');

/**
 * Configuration for collecting view.xml files.
 */
module.exports = {
    src: [
        path.resolve('../../magento/theme-frontend-blank'),
        path.resolve('../magesuite-content-constructor-frontend'),
        ...Object.values(parentAliases()).reverse(),
        paths.src,
    ].map((filePath) => path.join(filePath, 'etc/view.xml')),
    dest: paths.dist,
};
