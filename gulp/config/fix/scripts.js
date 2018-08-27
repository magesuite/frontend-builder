const path = require('path');

const paths = require('../../paths');

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
    prettier: {
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        tabWidth: 4,
        parser: 'typescript',
    },
    dest: paths.src,
};
