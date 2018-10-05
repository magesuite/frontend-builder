const fs = require('fs');
const util = require('util');

const environment = require('./gulp/environment');

const DefaultRegistry = require('undertaker-registry');

function MagesuiteRegistry() {
    DefaultRegistry.call(this);
}
util.inherits(MagesuiteRegistry, DefaultRegistry);

MagesuiteRegistry.prototype.init = function(taker) {
    taker.task(require('./gulp/tasks/buildWebpack'));

    taker.task(require('./gulp/tasks/buildSprites'));

    taker.task(require('./gulp/tasks/copyHtml'));
    taker.task(require('./gulp/tasks/copyImages'));
    taker.task(require('./gulp/tasks/copyTwig'));
    taker.task(require('./gulp/tasks/copyScripts'));
    taker.task(require('./gulp/tasks/copyUnchanged'));

    taker.task(require('./gulp/tasks/clean'));
    taker.task(require('./gulp/tasks/cleanCache'));
    taker.task(require('./gulp/tasks/browserSync'));

    taker.task(
        'build',
        taker.series(
            'clean',
            taker.parallel(
                'buildWebpack',
                'buildSprites',
                'copyHtml',
                'copyScripts',
                'copyImages',
                'copyTwig',
                'copyUnchanged'
            ),
            'cleanCache'
        )
    );

    taker.task(
        'watch',
        taker.series(function enableWatch(done) {
            environment.watch = true;
            done();
        }, 'build')
    );

    taker.task('serve', taker.series('watch', 'browserSync'));
};

module.exports = new MagesuiteRegistry();
