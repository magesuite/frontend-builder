const gulp = require('gulp');
const log = require('fancy-log');
const nodeSSH = require('node-ssh');
const { exec } = require('child_process');

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

    const connection = settings.magentoConnection;
    const command = `bin/magento cache:clean ${settings.cacheTypes.join(' ')}`;

    if (connection.type === 'ssh') {
        ssh.connect({
            host: connection.host,
            username: connection.username,
            agent: process.env.SSH_AUTH_SOCK,
            agentForward: Boolean(process.env.SSH_AUTH_SOCK),
        })
            .then(() =>
                ssh.execCommand(command, {
                    cwd: connection.path,
                })
            )
            .then(result => {
                ssh.dispose();
                log.info(result.stdout.replace(/\n/g, ' '));
                done();
            })
            .catch(error => {
                ssh.dispose();
                log.error(
                    `Could not SSH to ${connection.host} to clean the cache.`
                );
                log.error(error.message);
                done();
            });
        return;
    }

    if (connection.type === 'local') {
        exec(
            command,
            {
                cwd: connection.path,
            },
            (error, stdout) => {
                if (error) {
                    log.error(`Could not clean the cache.`);
                    log.error(error.message);
                } else {
                    log.info(stdout.replace(/\n/g, ' '));
                }
                done();
            }
        );
        return;
    }

    throw new TypeError(
        `Unknown \`config.cleanCache.magentoConnection.type\` value: ${connection.type}`
    );
};
