const fs = require('fs');
const path = require('path');

const capitalize = string =>
    string.replace(/^\w/, firstLetter => firstLetter.toUpperCase());

const traverseParents = themePath => {
    const themeXML = fs.readFileSync(
        path.resolve(themePath, 'src/theme.xml'),
        'utf8'
    );

    const parentMatch = themeXML.match(
        /<parent>[a-z0-9]+\/[^\-]+\-([a-z0-9]+)<\/parent>/i
    );

    if (parentMatch) {
        const parentName = parentMatch[1];
        const parentPath = path.resolve(`../theme-${parentName}`);

        if (fs.existsSync(parentPath)) {
            return [parentPath].concat(traverseParents(parentPath));
        }
    }

    return [];
};

const parentPaths = () => traverseParents(path.resolve('.'));

module.exports = parentPaths;
