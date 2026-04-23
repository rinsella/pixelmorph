'use strict';

const path = require('path');

// Hard limits, keep Railway containers safe.
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB per file
const MAX_FILES = 1000;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024 * 1024; // 20 GB per request

// Whitelisted output formats and their canonical extensions.
const OUTPUT_FORMATS = {
  jpg: { ext: 'jpg', mime: 'image/jpeg', sharp: 'jpeg' },
  jpeg: { ext: 'jpg', mime: 'image/jpeg', sharp: 'jpeg' },
  png: { ext: 'png', mime: 'image/png', sharp: 'png' },
  webp: { ext: 'webp', mime: 'image/webp', sharp: 'webp' }
};

// Accepted input extensions (heic/heif handled via heic-convert pre-step).
const INPUT_EXTS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.heic',
  '.heif'
]);

const INPUT_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  // Some browsers report HEIC as octet-stream; we double-check by extension.
  'application/octet-stream'
]);

function isHeic(filename, mime) {
  const ext = path.extname(filename || '').toLowerCase();
  return ext === '.heic' || ext === '.heif' || mime === 'image/heic' || mime === 'image/heif';
}

function sanitizeBaseName(name) {
  const base = path.basename(name || 'image', path.extname(name || ''));
  // Allow alphanumerics, dash, underscore, dot, space, collapse the rest.
  const cleaned = base.replace(/[^A-Za-z0-9._\- ]+/g, '_').trim();
  return cleaned.slice(0, 80) || 'image';
}

module.exports = {
  MAX_FILE_BYTES,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  OUTPUT_FORMATS,
  INPUT_EXTS,
  INPUT_MIMES,
  isHeic,
  sanitizeBaseName
};
