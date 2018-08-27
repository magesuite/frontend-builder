const gulp = require('gulp');
const loadTasks = require('gulp-task-loader');
// const sequence = require('run-sequence');
const environment = require('./gulp/environment');
console.log('Dupa');
/**
 *  Task for building entire project.
 */
gulp.task('build', () => {
    console.log('dupa');
});

// /**
//  *  Task for project linting.
//  */
// gulp.task('fix', done => {
//     sequence(['fix:scripts', 'fix:styles'], done);
// });

// /**
//  *  Task for project linting.
//  */
// gulp.task('lint', ['fix'], done => {
//     sequence(['lint:scripts', 'lint:styles'], done);
// });

// /**
//  *  Task for watching project files.
//  */
// gulp.task('watch', done => {
//     environment.watch = true;
//     sequence('build', done);
// });

// /**
//  *  Task for serving project files.
//  */
// gulp.task('serve', done => {
//     sequence('watch', 'maintain:serve', done);
// });

// /**
//  *  Task that fires project linting on every commit attempt.
//  */
// gulp.task('pre-push', done => {
//     sequence('lint', done);
// });

// /**
//  *  Default task
//  */
// gulp.task('default', ['build']);
