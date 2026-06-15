export default {
    'src/**/*.{css,scss}': ['stylelint --fix'],
    'src/**/*.{ts,js}': ['prettier --write', 'eslint --fix'],
};
