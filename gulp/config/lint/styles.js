const reporter = require('postcss-reporter');
const stylelint = require('stylelint');
const path = require('path');

const environment = require('../../environment');
const paths = require('../../paths');

/**
 * Settings for SASS linting task.
 */
const settings = {
    src: [
        /**
         * Lint everything inside components and layouts directories.
         */
        path.join(paths.src, '**/*.{css,scss,sass}'),
        '!' + path.join(paths.src, 'vendors/**/*.{css,scss,sass}'),
        '!' + path.join(paths.src, 'utilities/_sprites.scss'),
    ],
    processors: [
        stylelint({ syntax: 'scss' }),
        reporter({
            clearMessages: true,
            throwError: !environment.watch,
        }),
    ],
};

module.exports = settings;
