const path = require('path');
const { Transform } = require('readable-stream');
const imagemin = require('imagemin');
const log = require('fancy-log');
const PluginError = require('plugin-error');
const prettyBytes = require('pretty-bytes');

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

const isSupportedImage = file =>
    supportedExtensions.includes(path.extname(file.path).toLowerCase());

const formatPercent = (part, total) =>
    ((part / total) * 100).toFixed(1).replace(/\.0$/, '');

/**
 * Gulp stream that runs every supported image through the given imagemin plugins and logs the total saving.
 * @param {Array<(buffer: Buffer) => Promise<Buffer>>} plugins Imagemin plugins, applied in order.
 * @return {Transform}
 */
module.exports = function imageminStream(plugins) {
    let minifiedFiles = 0;
    let originalBytes = 0;
    let savedBytes = 0;

    const optimize = async file => {
        const optimized = await imagemin.buffer(file.contents, { plugins });
        const saved = file.contents.length - optimized.length;

        if (saved > 0) {
            minifiedFiles++;
            originalBytes += file.contents.length;
            savedBytes += saved;
        }

        file.contents = Buffer.from(optimized);
    };

    return new Transform({
        objectMode: true,
        transform(file, encoding, callback) {
            if (!isSupportedImage(file)) {
                callback(null, file);
                return;
            }

            optimize(file).then(
                () => callback(null, file),
                error =>
                    callback(
                        new PluginError('imagemin', error, {
                            fileName: file.path,
                        })
                    )
            );
        },
        flush(callback) {
            const noun = minifiedFiles === 1 ? 'image' : 'images';
            const saving = minifiedFiles
                ? ` (saved ${prettyBytes(savedBytes)} - ${formatPercent(
                      savedBytes,
                      originalBytes
                  )}%)`
                : '';

            log(`Minified ${minifiedFiles} ${noun}${saving}`);
            callback();
        },
    });
};
