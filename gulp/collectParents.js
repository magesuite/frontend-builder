/**
 * Utility for resolving the ordered list of parent theme paths by walking the
 * theme inheritance chain via src/theme.xml <parent> declarations.
 * Returns an array of absolute paths ordered from immediate parent to root ancestor.
 */
import fs from 'fs';
import path from 'path';

const traverseParents = (themePath) => {
    const themeXML = fs.readFileSync(
        path.resolve(themePath, 'src/theme.xml'),
        'utf8'
    );

    const parentMatch = themeXML.match(
        /<parent>[a-z0-9]+\/[^-]+-([a-z0-9]+)<\/parent>/i
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

export default parentPaths;
