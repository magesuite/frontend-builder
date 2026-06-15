import gulp from 'gulp';
import changed from 'gulp-changed';

import environment from '../environment.js';
import settings from '../config/copyDocs.js';
import srcExists from '../srcExists.js';

let firstRun = true;

/**
 * Task for copying documentation files (e.g. *.md) to the dist directory.
 * In watch mode, sets up a file watcher on the first run.
 * @return {Stream} Vinyl stream piped to the destination directory.
 */
export default function copyDocs() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, copyDocs);
    }

    if (!srcExists(settings.src)) {
        return Promise.resolve();
    }

    return gulp
        .src(settings.src)
        .pipe(changed(settings.dest))
        .pipe(gulp.dest(settings.dest));
}
