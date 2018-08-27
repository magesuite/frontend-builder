const path = require('path');
const paths = require('../../paths');
const environment = require('../../environment');

/**
 * Settings for TypeScript linting task.
 * @type {Object}
 */
module.exports = {
    src: [
        /**
         * Lint all TypeScript files.
         */
        path.join(paths.src, '**/*.ts'),
        '!' + path.join(paths.src, 'vendors/**/*.ts'),
    ],
    tslint: {
        formatter: 'stylish',
    },
    tslintReport: {
        emitError: !environment.watch,
        summarizeFailureOutput: true,
        allowWarnings: true,
    },
};
