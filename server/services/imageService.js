'use strict';

const sharp = require('sharp');
const heicConvert = require('heic-convert');
const { OUTPUT_FORMATS, isHeic } = require('../utils/validation');

/**
 * Convert a single image buffer.
 *
 * @param {Buffer} inputBuffer - raw uploaded bytes
 * @param {object} opts
 * @param {string} opts.originalName - original filename (used for HEIC detection)
 * @param {string} opts.mime - reported mime type
 * @param {string} opts.targetFormat - jpg | png | webp
 * @param {number} [opts.quality=82] - 1-100 (jpg/webp only)
 * @param {number} [opts.width] - optional resize width
 * @param {number} [opts.height] - optional resize height
 * @param {boolean} [opts.fit=true] - resize using "inside" fit instead of crop
 * @param {boolean} [opts.stripMetadata=true] - drop EXIF (default for privacy)
 * @returns {Promise<{buffer: Buffer, mime: string, ext: string}>}
 */
async function convertImage(inputBuffer, opts) {
  const {
    originalName,
    mime,
    targetFormat,
    quality = 82,
    width,
    height,
    fit = true,
    stripMetadata = true
  } = opts;

  const target = OUTPUT_FORMATS[(targetFormat || '').toLowerCase()];
  if (!target) {
    throw new Error(`Unsupported target format: ${targetFormat}`);
  }

  // Step 1: if HEIC/HEIF, decode to a PNG buffer first (sharp prebuilt
  // binaries do not include HEIF support on Linux containers).
  let workingBuffer = inputBuffer;
  if (isHeic(originalName, mime)) {
    try {
      const decoded = await heicConvert({
        buffer: inputBuffer,
        format: 'PNG'
      });
      workingBuffer = Buffer.from(decoded);
    } catch (err) {
      const e = new Error('Failed to decode HEIC/HEIF image. The file may be corrupted.');
      e.cause = err;
      throw e;
    }
  }

  // Step 2: pipeline through sharp.
  // rotate() with no args honors EXIF orientation then strips it, we want that.
  let pipeline = sharp(workingBuffer, { failOn: 'truncated' }).rotate();

  if (width || height) {
    pipeline = pipeline.resize({
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
      fit: fit ? 'inside' : 'cover',
      withoutEnlargement: true
    });
  }

  // Preserve metadata only if the user opts in.
  if (!stripMetadata) {
    pipeline = pipeline.withMetadata();
  }

  const q = Math.max(1, Math.min(100, Number(quality) || 82));

  switch (target.sharp) {
    case 'jpeg':
      // JPG has no alpha, flatten over white so PNG/WEBP transparency
      // does not become black.
      pipeline = pipeline
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: q, mozjpeg: true, progressive: true });
      break;
    case 'png':
      pipeline = pipeline.png({ compressionLevel: 9, palette: false });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality: q, effort: 4 });
      break;
    default:
      throw new Error(`Unsupported target format: ${targetFormat}`);
  }

  const outputBuffer = await pipeline.toBuffer();
  return { buffer: outputBuffer, mime: target.mime, ext: target.ext };
}

module.exports = { convertImage };
