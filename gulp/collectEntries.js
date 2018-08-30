const glob = require('glob');
const path = require('path');

module.exports = pathGlob => {
    const entries = {};
    glob.sync(pathGlob).forEach(file => {
        entries[path.basename(file, '.ts')] = file;
    });

    return entries;
};
