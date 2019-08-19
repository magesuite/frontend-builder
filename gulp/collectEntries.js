const glob = require('glob');
const path = require('path');

const paths = require('./paths');
const parentAliases = require('./parentAliases')();

module.exports = pathGlob => {
    const entries = {};

    const themeGlobs = [
        ...Object.values(parentAliases).reverse(),
        paths.src,
    ].map(themeSrcPath => path.join(themeSrcPath, pathGlob));

    themeGlobs.forEach(themeGlob => {
        glob.sync(themeGlob).forEach(file => {
            entries[path.basename(file, '.ts')] = file;
        });
    });

    return entries;
};
