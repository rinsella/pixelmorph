'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

const ACCEPT = '.jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif';
const MAX_FILES = 1000;
const MAX_BYTES = 25 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024 * 1024;

const FORMATS = [
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WEBP' }
];

function formatBytes(b) {
  if (!b && b !== 0) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function detectExt(name) {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

export default function Converter({ defaultFormat = 'jpg' }) {
  const [files, setFiles] = useState([]); // {file, preview, status, output?, error?}
  const [target, setTarget] = useState(defaultFormat);
  const [quality, setQuality] = useState(85);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [stripMetadata, setStripMetadata] = useState(true);
  const [busy, setBusy] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const totalBytes = useMemo(
    () => files.reduce((s, f) => s + f.file.size, 0),
    [files]
  );

  const acceptFiles = useCallback((fileList) => {
    setErrorMsg('');
    const incoming = Array.from(fileList || []);
    const next = [];
    for (const f of incoming) {
      const ext = detectExt(f.name);
      if (!['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(ext)) {
        setErrorMsg(`"${f.name}" is not a supported image format.`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        setErrorMsg(`"${f.name}" exceeds the 25MB per-file limit.`);
        continue;
      }
      next.push({
        id: `${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file: f,
        ext,
        preview: ext === 'heic' || ext === 'heif' ? null : URL.createObjectURL(f),
        status: 'queued'
      });
    }
    setFiles((prev) => {
      const merged = [...prev, ...next].slice(0, MAX_FILES);
      if (prev.length + next.length > MAX_FILES) {
        setErrorMsg(`Only the first ${MAX_FILES} files were added.`);
      }
      return merged;
    });
  }, []);

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer?.files?.length) acceptFiles(e.dataTransfer.files);
  }

  function removeFile(id) {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  }

  function clearAll() {
    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    setFiles([]);
    setJobId(null);
    setErrorMsg('');
  }

  async function convert() {
    if (files.length === 0 || busy) return;
    setBusy(true);
    setErrorMsg('');
    setJobId(null);
    setFiles((prev) => prev.map((f) => ({ ...f, status: 'uploading', output: undefined, error: undefined })));

    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f.file, f.file.name));
      fd.append('format', target);
      fd.append('quality', String(quality));
      if (width) fd.append('width', String(width));
      if (height) fd.append('height', String(height));
      fd.append('fit', 'true');
      fd.append('stripMetadata', String(stripMetadata));

      const res = await fetch('/api/convert', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || `Server error (${res.status})`);
      }
      setJobId(data.jobId);
      // Map results back to UI state by index (preserves order).
      setFiles((prev) =>
        prev.map((f, i) => {
          const r = data.files[i];
          if (!r) return { ...f, status: 'error', error: 'No result' };
          return r.status === 'ok'
            ? {
                ...f,
                status: 'done',
                output: {
                  id: r.id,
                  name: r.outputName,
                  size: r.outputSize,
                  url: `/api/download/${data.jobId}/${r.id}`
                }
              }
            : { ...f, status: 'error', error: r.error || 'Conversion failed' };
        })
      );
    } catch (e) {
      setErrorMsg(e.message || 'Conversion failed.');
      setFiles((prev) => prev.map((f) => ({ ...f, status: 'error', error: 'Conversion failed' })));
    } finally {
      setBusy(false);
    }
  }

  const okCount = files.filter((f) => f.status === 'done').length;
  const showQuality = target === 'jpg' || target === 'webp';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
      {/* Main column */}
      <section className="space-y-6">
        <div
          className="dropzone"
          data-active={dragActive}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="sr-only-input"
            onChange={(e) => acceptFiles(e.target.files)}
            aria-label="Choose images to convert"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-ink-900">
                Drag & drop images here
              </p>
              <p className="text-sm text-ink-500">
                or{' '}
                <button
                  type="button"
                  className="text-brand-700 font-semibold underline-offset-2 hover:underline"
                  onClick={() => inputRef.current?.click()}
                >
                  browse from your device
                </button>
              </p>
            </div>
            <p className="text-xs text-ink-500">
              Supports HEIC, HEIF, JPG, PNG, WEBP, up to {MAX_FILES} files (25MB each, 20GB total).
            </p>
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorMsg}
          </div>
        )}

        {files.length > 0 && (
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-ink-900">
                {files.length} file{files.length === 1 ? '' : 's'} •{' '}
                {formatBytes(totalBytes)}
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="text-sm text-ink-500 hover:text-ink-900"
              >
                Clear all
              </button>
            </div>
            <ul className="divide-y divide-gray-100">
              {files.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-3 px-4 py-3 sm:gap-4"
                >
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-xs font-semibold text-ink-500 uppercase">
                    {f.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={f.preview}
                        alt={`Preview of ${f.file.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      f.ext
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {f.file.name}
                    </p>
                    <p className="text-xs text-ink-500">
                      {f.ext.toUpperCase()} → {target.toUpperCase()} ·{' '}
                      {formatBytes(f.file.size)}
                      {f.output && ` → ${formatBytes(f.output.size)}`}
                    </p>
                  </div>
                  <StatusPill status={f.status} />
                  <div className="flex items-center gap-2">
                    {f.status === 'done' && f.output && (
                      <a
                        href={f.output.url}
                        download={f.output.name}
                        className="btn-secondary !px-3 !py-2 text-xs"
                      >
                        Download
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="text-ink-300 hover:text-ink-700"
                      aria-label={`Remove ${f.file.name}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M6 6l12 12M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-ink-500">
            All processing runs on the server. Files are auto-deleted after 15 minutes.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {jobId && okCount > 0 && (
              <a
                href={`/api/download-zip/${jobId}`}
                className="btn-secondary"
              >
                Download all (.zip)
              </a>
            )}
            <button
              type="button"
              onClick={convert}
              disabled={files.length === 0 || busy}
              className="btn-primary"
            >
              {busy ? (
                <>
                  <Spinner /> Converting…
                </>
              ) : (
                <>Convert {files.length > 0 ? `${files.length} file${files.length === 1 ? '' : 's'}` : ''}</>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Options panel */}
      <aside className="card p-5 space-y-5 lg:sticky lg:top-20 self-start">
        <div>
          <h2 className="text-sm font-semibold text-ink-900">Output format</h2>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setTarget(f.value)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ring-1 transition-all ${
                  target === f.value
                    ? 'bg-brand-600 text-white ring-brand-600'
                    : 'bg-white text-ink-900 ring-gray-200 hover:ring-gray-300'
                }`}
                aria-pressed={target === f.value}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {showQuality && (
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-ink-900">
              Quality
              <span className="text-ink-500 font-normal">{quality}</span>
            </label>
            <input
              type="range"
              min="40"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
              aria-label="Output quality"
            />
            <p className="mt-1 text-xs text-ink-500">
              Higher = better quality, larger files.
            </p>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-ink-900">Resize (optional)</h2>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs text-ink-500">Max width</span>
              <input
                type="number"
                min="1"
                placeholder="auto"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <label className="block">
              <span className="text-xs text-ink-500">Max height</span>
              <input
                type="number"
                min="1"
                placeholder="auto"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </label>
          </div>
          <p className="mt-1 text-xs text-ink-500">
            Images fit inside these bounds. Aspect ratio is preserved.
          </p>
        </div>

        <label className="flex items-start gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={stripMetadata}
            onChange={(e) => setStripMetadata(e.target.checked)}
            className="mt-1 h-4 w-4 accent-brand-600"
          />
          <span>
            <span className="font-semibold text-ink-900">Strip metadata</span>
            <span className="block text-xs text-ink-500">
              Removes EXIF/GPS data for privacy (recommended).
            </span>
          </span>
        </label>
      </aside>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    queued: { label: 'Ready', cls: 'bg-gray-100 text-ink-700' },
    uploading: { label: 'Working…', cls: 'bg-brand-50 text-brand-700' },
    done: { label: 'Done', cls: 'bg-emerald-50 text-emerald-700' },
    error: { label: 'Failed', cls: 'bg-red-50 text-red-700' }
  };
  const v = map[status] || map.queued;
  return (
    <span
      className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${v.cls}`}
    >
      {v.label}
    </span>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
