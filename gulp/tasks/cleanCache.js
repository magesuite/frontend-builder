import gulp from 'gulp';
import log from 'fancy-log';
import chalk from 'chalk';
import { NodeSSH } from 'node-ssh';
import { exec } from 'child_process';

import environment from '../environment.js';
import settings from '../config/cleanCache.js';

let firstRun = true;
const ssh = new NodeSSH();

/**
 * Task for clearing Magento's application cache after a build.
 * Supports three connection types: ssh, local, and docker.
 * Only runs in development mode — skipped silently in production/CI.
 * Connection settings are defined in gulp/config/cleanCache.js.
 * @param {Function} done Gulp callback to signal task completion.
 */
export default function cleanCache(done) {
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
            .then((result) => {
                ssh.dispose();
                log.info(result.stdout.replace(/\n/g, ' '));
                done();
            })
            .catch((error) => {
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

    if (connection.type === 'docker') {
        exec(
            `docker exec ${connection.container} bash -c "cd ${connection.path} && ${command}"`,
            (error, stdout) => {
                if (error) {
                    log.warn(
                        chalk.bold.yellow(
                            `⚠  Cache clean skipped — expected path ${connection.path} not found inside container ${connection.container}. Is the correct Docker project running?`
                        )
                    );
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
}
