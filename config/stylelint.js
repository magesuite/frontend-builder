export default {
    extends: [
        'stylelint-config-recommended-scss',
        'stylelint-prettier/recommended',
    ],
    rules: {
        // Disabled because it conflicts with prettier's line-breaking behaviour —
        // prettier formats long expressions with the operator at the end of the line.
        'scss/operator-no-newline-after': null,
        'scss/dollar-variable-colon-space-after': 'always-single-line',
        // Disabled to support un-migrated @import-based SCSS. These rules are violated
        // by the old module system and cannot be fixed without the mgs-migrate-sass migration.
        'scss/no-global-function-names': null,
        'scss/load-partial-extension': null,
        'scss/load-no-partial-leading-underscore': null,
        'no-invalid-position-at-import-rule': null,
        'property-no-deprecated': null,
        'declaration-property-value-keyword-no-deprecated': null,
        'scss/comment-no-empty': null,
        'scss/no-duplicate-mixins': null,
        'declaration-block-no-duplicate-properties': null,
        'property-no-unknown': [
            true,
            {
                ignoreProperties: ['size-adjust', 'print-color-adjust'],
            },
        ],
        'unit-no-unknown': [
            true,
            {
                ignoreUnits: ['dvh'],
            },
        ],
    },
    ignoreFiles: ['src/etc/**/*', 'src/**/vendors/**/*', 'src/**/vendor/**/*'],
};
