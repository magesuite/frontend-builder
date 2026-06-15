import fs from 'fs';

/**
 * Returns true if at least one base directory from the given glob patterns exists.
 * Prevents ENOENT crashes in gulp.src() when a child theme omits optional source
 * directories (e.g. src/web/js, src/doc, src/web/images).
 *
 * @param {string[]} globs - Array of glob patterns (as used in gulp.src config).
 * @returns {boolean}
 */
export default function srcExists(globs) {
    return (Array.isArray(globs) ? globs : [globs]).some((pattern) => {
        const base = pattern.split(/\/[*{]/)[0];
        return fs.existsSync(base);
    });
}
