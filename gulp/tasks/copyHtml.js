const gulp = require('gulp');
const changed = require('gulp-changed');

const environment = require('../environment');
const settings = require('../config/copyHtml');

let firstRun = true;

module.exports = function copyHtml() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch([settings.watch], this);
    }

    return gulp
        .src(settings.src)
        .pipe(changed(settings.dest))
        .pipe(gulp.dest(settings.dest));
};
