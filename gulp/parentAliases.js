const fs = require('fs');
const path = require('path');

const capitalize = string =>
    string.replace(/^\w/, firstLetter => firstLetter.toUpperCase());

const traverseAliases = themePath => {
    const themeXML = fs.readFileSync(
        path.resolve(themePath, 'src/theme.xml'),
        'utf8'
    );

    const parentMatch = themeXML.match(
        /<parent>[a-z]+\/[^\-]+\-([a-z]+)<\/parent>/i
    );

    console.log(themeXML);

    if (parentMatch) {
        const parentName = parentMatch[1];
        const parentPath = path.resolve(`../theme-${parentName}`);

        if (fs.existsSync(parentPath)) {
            const aliases = {
                [capitalize(parentName)]: path.join(parentPath, 'src'),
            };

            return Object.assign(aliases, getParentAliases(parentPath));
        }
    }

    return {};
};

const parentAliases = () => traverseAliases(path.resolve('.'));

module.exports = parentAliases;
