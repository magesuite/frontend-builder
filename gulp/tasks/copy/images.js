const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const environment = require('../../environment');
const settings = require('../../config/copy/images');

let firstRun = true;

module.exports = function() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        this.gulp.watch([settings.watch], ['copy:images']);
    }

    return this.gulp
        .src(settings.src)
        .pipe(gulpif(environment.production, imagemin(settings.imagemin)))
        .pipe(this.gulp.dest(settings.dest));
};
