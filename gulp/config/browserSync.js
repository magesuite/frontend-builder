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
            target: 'http://magesuite.me',
        },
        rewriteRules: [
            {
                match: '.magesuite.me',
                replace: '',
            },
        ],
        serveStatic: [
            {
                route: `${paths.distWeb}/en_US`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/en_GB`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/de_DE`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/en_DE`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/de_AT`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/en_AT`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/de_CH`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/en_CH`,
                dir: `${paths.dist}/web`,
            },
        ],
        files: [`${paths.dist}/**/*`],
        reloadDelay: 1000,
        cors: true,
    },
};

module.exports = settings;
