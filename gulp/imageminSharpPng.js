import sharp from 'sharp';

const pngSignature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const isPng = (buffer) =>
    pngSignature.equals(buffer.subarray(0, pngSignature.length));

/**
 * Imagemin plugin that reduces PNG files to a colour palette with the libimagequant quantiser built into sharp.
 * @param {import('sharp').PngOptions} options Options passed to sharp's png() output.
 * @return {(buffer: Buffer) => Promise<Buffer>}
 */
export default (options) => async (buffer) => {
    if (!isPng(buffer)) {
        return buffer;
    }

    return sharp(buffer)
        .png({ ...options, palette: true })
        .toBuffer();
};
