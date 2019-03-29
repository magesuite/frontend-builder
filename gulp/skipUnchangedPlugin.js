const fs = require('fs-extra');
const path = require('path');
const log = require('webpack-log');

const logger = log({ name: 'skip-unchanged' });

/**
 * Plugin that prevents Webpack from emitting certain file if it is identical to an existing one.
 */
module.exports = class SkipUnchangedPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.emit.tapPromise('Hello World Plugin', compilation => {
            const outputPath = compilation.outputOptions.path;
            const fileNames = Object.keys(compilation.assets);
            const skippedFiles = [];
            return Promise.all(
                fileNames.map(fileName =>
                    fs
                        .readFile(path.join(outputPath, fileName), 'utf8')
                        .catch(() => {
                            // Output does not exist, nothing to compare.
                        })
                        .then(outputSource => {
                            if (
                                outputSource ===
                                compilation.assets[fileName].source()
                            ) {
                                skippedFiles.push(fileName);
                                delete compilation.assets[fileName];
                            }
                        })
                )
            ).then(() => {
                if (this.options.debug && skippedFiles.length) {
                    skippedFiles.forEach(skippedFile => {
                        logger.info(`${skippedFile} didn't change, skipping.`);
                    });
                }
            });
        });
    }
};
