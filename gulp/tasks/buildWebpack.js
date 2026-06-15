import PluginError from 'plugin-error';
import log from 'fancy-log';
import chalk from 'chalk';
import webpack from 'webpack';

import environment from '../environment.js';
import settings from '../config/buildWebpack.js';

// Indicate if we are running the task the first time in watch mode.
let firstRun = true;

/**
 * Task for compiling components' JS files.
 * @return {Promise} Promise used to properly time task execution completition.
 */
export default function buildWebpack(done) {
    const compiler = webpack(settings.webpack);
    const callback = (error, stats) => {
        if (error) {
            throw new PluginError('webpack', error);
        }

        if (environment.verbose) {
            log(
                stats.toString({
                    colors: true,
                    assets: true,
                    warnings: true,
                    modules: false,
                    entrypoints: false,
                    hash: false,
                    builtAt: false,
                })
            );
        } else {
            log(
                stats.toString({
                    colors: true,
                    modules: false,
                    entrypoints: false,
                    hash: false,
                    builtAt: false,
                    warnings: false,
                    assets: false,
                })
            );
            if (stats.hasWarnings()) {
                const { warnings } = stats.toJson({ warnings: true });
                const isPerfWarning = (w) =>
                    w.message.includes('size limit') ||
                    w.message.includes('performance recommendations');
                const perfWarnings = warnings.filter(isPerfWarning);
                const buildWarnings = warnings.filter((w) => !isPerfWarning(w));
                if (buildWarnings.length) {
                    log.warn(
                        `Build completed with ${buildWarnings.length} warning(s). Run yarn build:verbose for details.`
                    );
                }
                if (perfWarnings.length) {
                    log.warn(
                        chalk.bold.yellow(
                            `⚠  ${perfWarnings.length} asset(s) exceed recommended size limits. Run yarn build:verbose for details.`
                        )
                    );
                }
            }
        }

        if (!environment.watch && stats.hasErrors()) {
            throw new PluginError(
                'webpack',
                'There were errors during webpack build!'
            );
        }

        if (firstRun) {
            done();
            firstRun = false;
        }
    };

    if (environment.watch !== true) {
        compiler.run(callback);
    } else {
        compiler.watch({}, callback);
    }
}
