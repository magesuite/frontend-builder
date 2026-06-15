import gulp from 'gulp';
import changed from 'gulp-changed';

import environment from '../environment.js';
import settings from '../config/copyScripts.js';
import srcExists from '../srcExists.js';

let firstRun = true;

/**
 * Task for copying plain JS script files (e.g. vendor scripts) to the dist directory.
 * Only changed files are copied (via gulp-changed) to avoid unnecessary writes.
 * In watch mode, sets up a file watcher on the first run.
 * @return {Stream} Vinyl stream piped to the destination directory.
 */
export default function copyScripts() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, copyScripts);
    }

    if (!srcExists(settings.src)) {
        return Promise.resolve();
    }

    return gulp
        .src(settings.src)
        .pipe(changed(settings.dest))
        .pipe(gulp.dest(settings.dest));
}
