'use strict';

const express = require('express');
const multer = require('multer');
const archiver = require('archiver');
const path = require('path');
const crypto = require('crypto');

const { convertImage } = require('../services/imageService');
const {
  MAX_FILE_BYTES,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  OUTPUT_FORMATS,
  INPUT_EXTS,
  INPUT_MIMES,
  sanitizeBaseName
} = require('../utils/validation');

const router = express.Router();

// In-memory storage, files never touch disk. Safer + faster on Railway's
// ephemeral filesystem.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_BYTES,
    files: MAX_FILES
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!INPUT_EXTS.has(ext)) {
      return cb(new Error(`Unsupported file type: ${ext || 'unknown'}`));
    }
    if (file.mimetype && !INPUT_MIMES.has(file.mimetype)) {
      // Some mobile browsers mislabel HEIC, fall back to extension.
      if (!(ext === '.heic' || ext === '.heif')) {
        return cb(new Error(`Unsupported MIME type: ${file.mimetype}`));
      }
    }
    cb(null, true);
  }
});

/**
 * In-memory job store. Each conversion request gets a short-lived job whose
 * results can be downloaded individually or as a ZIP. Jobs auto-expire.
 *
 * NOTE: On Railway with multiple replicas this would need shared storage,
 * but for a single-instance container this is the simplest reliable design
 * and avoids touching the ephemeral disk.
 */
const JOBS = new Map();
const JOB_TTL_MS = 15 * 60 * 1000; // 15 minutes

function createJobId() {
  return crypto.randomBytes(12).toString('hex');
}

function scheduleJobCleanup(jobId) {
  setTimeout(() => JOBS.delete(jobId), JOB_TTL_MS).unref();
}

function parseBool(v, fallback = false) {
  if (v === undefined || v === null) return fallback;
  if (typeof v === 'boolean') return v;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}

function parseIntOrUndef(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

// POST /api/convert - multipart/form-data
//   files: one or more images
//   format: jpg | png | webp
//   quality: 1-100 (optional)
//   width/height: optional resize
//   fit: bool, default true (inside)
//   stripMetadata: bool, default true
router.post('/convert', (req, res) => {
  upload.array('files', MAX_FILES)(req, res, async (err) => {
    if (err) {
      const msg =
        err.code === 'LIMIT_FILE_SIZE'
          ? `File too large. Max ${Math.round(MAX_FILE_BYTES / 1024 / 1024)}MB per file.`
          : err.code === 'LIMIT_FILE_COUNT'
            ? `Too many files. Max ${MAX_FILES} per request.`
            : err.message || 'Upload failed.';
      return res.status(400).json({ ok: false, error: msg });
    }

    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ ok: false, error: 'No files uploaded.' });
    }

    const totalBytes = files.reduce((s, f) => s + f.size, 0);
    if (totalBytes > MAX_TOTAL_BYTES) {
      return res
        .status(413)
        .json({ ok: false, error: 'Total upload size exceeds the limit.' });
    }

    const targetFormat = String(req.body.format || 'jpg').toLowerCase();
    if (!OUTPUT_FORMATS[targetFormat]) {
      return res
        .status(400)
        .json({ ok: false, error: `Unsupported target format: ${targetFormat}` });
    }

    const opts = {
      targetFormat,
      quality: parseIntOrUndef(req.body.quality) || 82,
      width: parseIntOrUndef(req.body.width),
      height: parseIntOrUndef(req.body.height),
      fit: parseBool(req.body.fit, true),
      stripMetadata: parseBool(req.body.stripMetadata, true)
    };

    const jobId = createJobId();
    const results = [];

    for (const f of files) {
      try {
        const { buffer, mime, ext } = await convertImage(f.buffer, {
          ...opts,
          originalName: f.originalname,
          mime: f.mimetype
        });

        const safeBase = sanitizeBaseName(f.originalname);
        const outputName = `${safeBase}.${ext}`;

        results.push({
          id: crypto.randomBytes(8).toString('hex'),
          status: 'ok',
          originalName: f.originalname,
          originalSize: f.size,
          outputName,
          outputSize: buffer.length,
          mime,
          buffer
        });
      } catch (e) {
        results.push({
          id: crypto.randomBytes(8).toString('hex'),
          status: 'error',
          originalName: f.originalname,
          originalSize: f.size,
          error: (e && e.message) || 'Conversion failed.'
        });
      }
    }

    JOBS.set(jobId, { createdAt: Date.now(), results });
    scheduleJobCleanup(jobId);

    // Strip buffers from JSON response, clients fetch via /download.
    const responseFiles = results.map((r) => ({
      id: r.id,
      status: r.status,
      originalName: r.originalName,
      originalSize: r.originalSize,
      outputName: r.outputName,
      outputSize: r.outputSize,
      error: r.error
    }));

    res.json({
      ok: true,
      jobId,
      targetFormat,
      files: responseFiles
    });
  });
});

// GET /api/download/:jobId/:fileId
router.get('/download/:jobId/:fileId', (req, res) => {
  const job = JOBS.get(req.params.jobId);
  if (!job) return res.status(404).json({ ok: false, error: 'Job not found or expired.' });
  const file = job.results.find((r) => r.id === req.params.fileId && r.status === 'ok');
  if (!file) return res.status(404).json({ ok: false, error: 'File not found.' });

  res.setHeader('Content-Type', file.mime);
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodeURIComponent(file.outputName)}"`
  );
  res.setHeader('Content-Length', file.buffer.length);
  res.end(file.buffer);
});

// GET /api/download-zip/:jobId
router.get('/download-zip/:jobId', (req, res) => {
  const job = JOBS.get(req.params.jobId);
  if (!job) return res.status(404).json({ ok: false, error: 'Job not found or expired.' });
  const okFiles = job.results.filter((r) => r.status === 'ok');
  if (okFiles.length === 0) {
    return res.status(400).json({ ok: false, error: 'No converted files in this job.' });
  }

  const archive = archiver('zip', { zlib: { level: 9 } });
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="pixelmorph-${req.params.jobId}.zip"`
  );

  archive.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('zip error', err);
    if (!res.headersSent) {
      res.status(500).json({ ok: false, error: 'Failed to build ZIP.' });
    } else {
      res.destroy(err);
    }
  });

  archive.pipe(res);

  // De-duplicate names so identical inputs don't clobber each other.
  const seen = new Map();
  for (const f of okFiles) {
    let name = f.outputName;
    const count = seen.get(name) || 0;
    if (count > 0) {
      const ext = path.extname(name);
      const base = name.slice(0, -ext.length);
      name = `${base} (${count})${ext}`;
    }
    seen.set(f.outputName, count + 1);
    archive.append(f.buffer, { name });
  }
  archive.finalize();
});

module.exports = router;
