const scss = require('postcss-scss');
const postcss = require('gulp-postcss');
const settings = require('../../config/lint/styles');

module.exports = function() {
    return this.gulp
        .src(settings.src)
        .pipe(postcss(settings.processors, { syntax: scss }));
};
