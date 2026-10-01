const sharp = require('sharp');

// Every JPEG file starts with the bytes FF D8 FF.
const isJpeg = buffer =>
    buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

/**
 * Imagemin plugin that compresses JPEG files with the mozjpeg encoder built into sharp.
 * @param {import('sharp').JpegOptions} options Options passed to sharp's jpeg() output.
 * @return {(buffer: Buffer) => Promise<Buffer>}
 */
module.exports = options => async buffer => {
    if (!isJpeg(buffer)) {
        return buffer;
    }

    return sharp(buffer)
        .jpeg({ ...options, mozjpeg: true })
        .toBuffer();
};
