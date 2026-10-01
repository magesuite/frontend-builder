/**
 * Imagemin plugin for PNG files. Loads imagemin-pngquant, which is an ES module, on first use.
 * @param {object} options Options passed to imagemin-pngquant.
 * @return {(buffer: Buffer) => Promise<Buffer>}
 */
module.exports = options => async buffer => {
    const { default: imageminPngquant } = await import('imagemin-pngquant');

    return Buffer.from(await imageminPngquant(options)(buffer));
};
