import fs from 'fs-extra';
import path from 'path';
import log from 'fancy-log';

/**
 * Plugin that prevents Webpack from emitting a file if it is identical to an existing one.
 */
export default class SkipUnchangedPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap(
            'SkipUnchangedPlugin',
            (compilation) => {
                compilation.hooks.processAssets.tapPromise(
                    {
                        name: 'SkipUnchangedPlugin',
                        stage: compiler.webpack.Compilation
                            .PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER,
                    },
                    async (assets) => {
                        const outputPath = compilation.outputOptions.path;
                        const skippedFiles = [];

                        await Promise.all(
                            Object.keys(assets).map(async (fileName) => {
                                try {
                                    const outputSource = await fs.readFile(
                                        path.join(outputPath, fileName),
                                        'utf8'
                                    );
                                    if (
                                        outputSource ===
                                        compilation.assets[fileName].source()
                                    ) {
                                        skippedFiles.push(fileName);
                                        compilation.deleteAsset(fileName);
                                    }
                                } catch {
                                    // Output does not exist, nothing to compare.
                                }
                            })
                        );

                        if (this.options.debug && skippedFiles.length) {
                            skippedFiles.forEach((skippedFile) => {
                                log.info(
                                    `[skip-unchanged] ${skippedFile} didn't change, skipping.`
                                );
                            });
                        }
                    }
                );
            }
        );
    }
}
