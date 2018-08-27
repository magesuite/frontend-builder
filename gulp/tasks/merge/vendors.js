const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const environment = require('../../environment');
const settings = require('../../config/merge/vendors');

let firstRun = true;

module.exports = function() {
    // If we are in watch mode, add watchers for this task.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        this.gulp.watch([settings.watch], ['merge:vendors']);
    }

    return this.gulp
        .src(settings.src)
        .pipe(concat(settings.filename))
        .pipe(gulpIf(environment.production, uglify(settings.uglify)))
        .pipe(this.gulp.dest(settings.dest));
};
