module.exports = {
    extends: [
        'stylelint-config-recommended',
        'stylelint-config-recommended-scss',
        'stylelint-config-prettier',
        'stylelint-prettier/recommended',
    ],
    plugins: ['stylelint-scss'],
    rules: {
        'scss/at-import-no-partial-leading-underscore': true,
        'scss/operator-no-unspaced': true,
        'scss/dollar-variable-no-missing-interpolation': true,
        'scss/dollar-variable-colon-space-after': 'always-single-line',
    },
    ignoreFiles: ['src/etc/**/*', 'src/**/vendors/**/*', 'src/**/vendor/**/*'],
};
