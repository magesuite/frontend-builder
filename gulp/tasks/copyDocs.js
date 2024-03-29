const gulp = require('gulp');
const changed = require('gulp-changed');

const environment = require('../environment');
const settings = require('../config/copyDocs');

let firstRun = true;

module.exports = function copyDocs() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, copyDocs);
    }

    return gulp
        .src(settings.src)
        .pipe(changed(settings.dest))
        .pipe(gulp.dest(settings.dest));
};
