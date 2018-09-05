const gulp = require('gulp');
const changed = require('gulp-changed');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');

const environment = require('../environment');
const settings = require('../config/copyImages');

let firstRun = true;

module.exports = function copyImages() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, copyImages);
    }

    return gulp
        .src(settings.src)
        .pipe(changed(settings.dest))
        .pipe(gulpif(environment.production, imagemin(settings.imagemin)))
        .pipe(gulp.dest(settings.dest));
};
