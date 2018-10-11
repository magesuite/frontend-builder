const gulp = require('gulp');
const gulpif = require('gulp-if');
const changed = require('gulp-changed');

const environment = require('../environment');
const settings = require('../config/copyUnchanged');
// const invalidateStatic = require('../invalidateStatic');

let firstRun = true;

module.exports = function copyUnchanged() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, copyUnchanged);
    }

    return gulp
        .src(settings.src)
        .pipe(changed(settings.dest))
        // .pipe(gulpif(environment.development, invalidateStatic.pipe()))
        .pipe(gulp.dest(settings.dest));
};
