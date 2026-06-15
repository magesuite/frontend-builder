/**
 * Utility for resolving webpack alias mappings for parent themes.
 * Walks the theme inheritance chain and returns an object mapping each parent
 * theme's capitalized name to its src directory path (e.g. { Creativeshop: '/path/to/src' }).
 * Used by webpack to resolve imports like 'Creativeshop/component/...' across theme layers.
 * Results are cached per theme path to avoid repeated filesystem traversal.
 */
import fs from 'fs';
import path from 'path';

const capitalize = (string) =>
    string.replace(/^\w/, (firstLetter) => firstLetter.toUpperCase());

const traverseAliases = (themePath) => {
    const themeXML = fs.readFileSync(
        path.resolve(themePath, 'src/theme.xml'),
        'utf8'
    );

    const parentMatch = themeXML.match(
        /<parent>([a-z0-9]+)\/[^-]+-([a-z0-9]+)<\/parent>/i
    );

    if (parentMatch) {
        const parentVendor = parentMatch[1].toLowerCase();
        const parentName = parentMatch[2];
        const parentPath = path.resolve(
            `../../${parentVendor}/theme-${parentName}`
        );

        if (fs.existsSync(parentPath)) {
            const aliases = {
                [capitalize(parentName)]: path.join(parentPath, 'src'),
            };

            return Object.assign(aliases, traverseAliases(parentPath));
        }
    }

    return {};
};

const aliasesCache = {};

const parentAliases = (themePath = path.resolve('.')) => {
    if (!aliasesCache[themePath]) {
        aliasesCache[themePath] = traverseAliases(themePath);
    }

    return aliasesCache[themePath];
};

export default parentAliases;
