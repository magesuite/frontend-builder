import gulp from 'gulp';
import changed from 'gulp-changed';

import environment from '../environment.js';
import settings from '../config/copyUnchanged.js';
import srcExists from '../srcExists.js';

let firstRun = true;

/**
 * Task for copying miscellaneous static assets (fonts, icons, etc.) that require
 * no processing to the dist directory. Only changed files are copied.
 * In watch mode, sets up a file watcher on the first run.
 * @return {Stream} Vinyl stream piped to the destination directory.
 */
export default function copyUnchanged() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, copyUnchanged);
    }

    if (!srcExists(settings.src)) {
        return Promise.resolve();
    }

    return gulp
        .src(settings.src, { encoding: false })
        .pipe(changed(settings.dest))
        .pipe(gulp.dest(settings.dest, { encoding: false }));
}
