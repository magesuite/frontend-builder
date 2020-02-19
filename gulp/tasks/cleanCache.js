const gulp = require('gulp');
const log = require('fancy-log');
const path = require('path');
const nodeSSH = require('node-ssh');

const environment = require('../environment');
const settings = require('../config/cleanCache');

let firstRun = true;
const ssh = new nodeSSH();

module.exports = function cleanCache(done) {
    if (!environment.development) {
        log.info(
            'Skipping clearing the cache since we are not in development mode.'
        );
        done();
        return;
    }

    // Initiate watch only the first time.
    if (firstRun && environment.watch) {
        firstRun = false;
        gulp.watch(settings.watch, cleanCache);
    }

    ssh.connect({
        host: 'creativeshop.me',
        username: 'magento2',
        privateKey: path.resolve(
            '../../../../../vagrant/ssh/creativeshop_vagrant.key'
        ),
    })
        .then(() =>
            ssh.execCommand(
                `bin/magento cache:clean ${settings.cacheTypes.join(' ')}`,
                {
                    cwd: '/var/www/creativeshop/current',
                }
            )
        )
        .then(result => {
            ssh.dispose();
            log.info(result.stdout.replace(/\n/g, ' '));
            done();
        })
        .catch(error => {
            ssh.dispose();
            log.error('Could not SSH to creativeshop.me to clean the cache.');
            log.error(error.message);
            done();
        });
};
