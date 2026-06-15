import gulp from 'gulp';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';

import environment from '../environment.js';
import settings from '../config/copyImages.js';
import srcExists from '../srcExists.js';

let firstRun = true;

/**
 * Task for copying and optionally optimizing image assets to the dist directory.
 * In development mode: copies changed files only, no optimization.
 * In production mode: runs imagemin (mozjpeg, pngquant, svgo).
 * In watch mode, sets up a file watcher on the first run.
 * @return {Stream|Promise} Stream in development, Promise in production.
 */
export default function copyImages() {
    // Initiate watch only the first time.
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, copyImages);
    }

    if (!srcExists(settings.src)) {
        return Promise.resolve();
    }

    if (!environment.production) {
        return gulp
            .src(settings.src, { encoding: false })
            .pipe(changed(settings.dest))
            .pipe(gulp.dest(settings.dest, { encoding: false }));
    }

    return new Promise((resolve, reject) => {
        gulp.src(settings.src, { encoding: false })
            .pipe(changed(settings.dest))
            .pipe(
                imagemin(
                    [
                        imageminPngquant(settings.pngquant),
                        imageminMozjpeg(settings.mozjpeg),
                        imageminSvgo(settings.svgo),
                    ],
                    { verbose: false }
                )
            )
            .pipe(gulp.dest(settings.dest))
            .on('end', resolve)
            .on('error', reject);
    });
}
