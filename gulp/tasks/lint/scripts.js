const tslint = require('gulp-tslint');
const settings = require('../../config/lint/scripts');

module.exports = function() {
    return this.gulp
        .src(settings.src)
        .pipe(tslint(settings.tslint))
        .pipe(tslint.report(settings.tslintReport));
};
