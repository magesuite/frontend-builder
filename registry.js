const fs = require('fs');
const util = require('util');

const DefaultRegistry = require('undertaker-registry');

function MagesuiteRegistry() {
    DefaultRegistry.call(this);
}
util.inherits(MagesuiteRegistry, DefaultRegistry);

MagesuiteRegistry.prototype.init = function(taker) {
    taker.task(require('./gulp/tasks/buildWebpack'));

    taker.task(require('./gulp/tasks/copyHtml'));
    taker.task(require('./gulp/tasks/copyImages'));
    taker.task(require('./gulp/tasks/copyTwig'));
    taker.task(require('./gulp/tasks/copyUnchanged'));

    taker.task(require('./gulp/tasks/clean'));
    taker.task(require('./gulp/tasks/browserSync'));

    taker.task(
        'build',
        taker.series(
            'clean',
            taker.parallel(
                'buildWebpack',
                'copyHtml',
                'copyImages',
                'copyTwig',
                'copyUnchanged'
            )
        )
    );

    taker.task('serve', taker.series('build', 'browserSync'));
};

module.exports = new MagesuiteRegistry();
