/**
 * Utility for collecting webpack entry points from the theme and all parent themes.
 * Resolves a glob pattern against each theme's src directory in inheritance order,
 * so child theme entries override parent entries with the same basename.
 * @param {string} pathGlob Glob pattern relative to each theme's src directory (e.g. 'entries/*.ts').
 * @return {Object} Map of entry name → absolute file path passed to webpack's entry config.
 */
import { globSync } from 'glob';
import path from 'path';

import paths from './paths.js';
import parentAliases from './parentAliases.js';

export default (pathGlob) => {
    const entries = {};

    const themeGlobs = [
        ...Object.values(parentAliases()).reverse(),
        paths.src,
    ].map((themeSrcPath) => path.join(themeSrcPath, pathGlob));

    themeGlobs.forEach((themeGlob) => {
        globSync(themeGlob).forEach((file) => {
            entries[path.basename(file, '.ts')] = file;
        });
    });

    return entries;
};
