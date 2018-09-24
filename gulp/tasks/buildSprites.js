const gulp = require('gulp');
const svgSprite = require('gulp-svg-sprite');
const log = require('fancy-log');

const environment = require('../environment');
const settings = require('../config/buildSprites');
// Indicate if we are running the task the first time in watch mode.
let firstRun = true;

module.exports = function buildSprites() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, buildSprites);
    }

    return gulp
        .src(settings.src)
        .pipe(svgSprite(settings.svgSprite))
        .on('error', error => {
            if (!environment.watch) {
                throw error;
            }

            log.error(error.message);
            this.emit('end');
        })
        .pipe(gulp.dest(settings.dest));
};
