module.exports = {
    hooks: {
        'pre-commit':
            'lint-staged -c @creativestyle/magesuite-frontend-builder/config/lint-staged',
    },
};
