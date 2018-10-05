const argv = require('yargs').argv;

const paths = require('../paths');

/**
 * Settings for serve task.
 */
const settings = {
    /**
     * BrowserSync configuration.
     */
    browserSync: {
        open: argv.open,
        proxy: {
            target: 'http://creativeshop.me',
        },
        files: [`${paths.dist}/**/*`],
        reloadDelay: 2000,
        injectChanges: false,
    },
};

module.exports = settings;
