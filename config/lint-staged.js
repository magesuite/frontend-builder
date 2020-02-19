module.exports = {
    'src/**/*.{css,scss}': ['stylelint --fix'],
    'src/**/*.{ts,js}': ['prettier --write', 'tslint --fix'],
};
