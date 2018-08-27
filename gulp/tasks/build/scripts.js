const path = require('path');
const PluginError = require('plugin-error');
const log = require('fancy-log');
const webpack = require('webpack');

const environment = require('../../environment');
const settings = require('../../config/build/scripts');
// Indicate if we are running the task the first time in watch mode.
let firstRun = true;

/**
 * Task for compiling components' JS files.
 * @return {Promise} Promise used to properly time task execution completition.
 */
module.exports = function(done) {
    const compiler = webpack(settings.webpack);
    const callback = (error, stats) => {
        if (error) {
            throw new PluginError('webpack', err);
        }
        log(
            stats.toString({
                colors: true,
                modules: false,
                entrypoints: false,
            })
        );

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
};
