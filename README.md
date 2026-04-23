# PixelMorph

A premium, production-ready online image converter built with **Next.js (App Router)**, **Express**, **sharp**, and **heic-convert**. PixelMorph converts between **HEIC, JPG, PNG and WEBP** with batch upload, ZIP download, quality control, resize, EXIF stripping, and full SEO/SSR support, ready to deploy to **Railway** in one click.

> Repo name suggestion: `pixelmorph` or `pixelmorph-image-converter`

---

## ✨ Features

- **Real HEIC support in Linux containers** (uses `heic-convert` so it doesn’t rely on macOS-only system libraries)
- HEIC → JPG, HEIC → PNG, JPG ⇄ PNG, JPG ⇄ WEBP, PNG ⇄ WEBP
- Drag-and-drop + file picker upload
- Batch conversion (up to 25 files / 25MB each / 150MB per batch)
- Per-file status with downloadable individual results
- One-click **ZIP download** of all converted files
- Quality slider (JPG / WEBP) and optional resize (max width / height, fit-inside)
- Optional EXIF / GPS metadata stripping (on by default for privacy)
- Mobile-first, responsive premium UI (Tailwind, Inter font)
- Full SEO: per-page metadata, Open Graph, Twitter cards, canonical URLs, dynamic `sitemap.xml`, dynamic `robots.txt`, JSON-LD (`WebApplication`, `FAQPage`)
- Custom 404 page, accessible forms, keyboard navigation
- Health check endpoint for Railway: `GET /healthz`

---

## 🧱 Tech Stack

| Layer       | Choice                                       |
| ----------- | -------------------------------------------- |
| Frontend    | Next.js 14 (App Router, RSC), React 18       |
| Styling     | Tailwind CSS 3                               |
| Backend     | Express 4 (custom server wrapping Next.js)   |
| Image core  | `sharp` 0.33 + `heic-convert` 2              |
| Uploads     | `multer` (in-memory, no disk writes)         |
| Zip         | `archiver`                                   |
| Container   | Node 20 (Debian Bookworm slim)               |
| Deploy      | Railway (Dockerfile build), also runs anywhere Docker runs |

---

## 📁 Folder Structure

```
.
├── app/                       # Next.js App Router pages (SSR/SEO)
│   ├── layout.js              # Root layout, Inter font, JSON-LD
│   ├── page.js                # Home
│   ├── converter/             # /converter
│   ├── features/              # /features
│   ├── supported-formats/     # /supported-formats
│   ├── faq/                   # /faq (with FAQPage schema)
│   ├── privacy-policy/
│   ├── terms-of-service/
│   ├── contact/
│   ├── about/
│   ├── not-found.js           # Custom 404
│   ├── sitemap.js             # Dynamic /sitemap.xml
│   ├── robots.js              # Dynamic /robots.txt
│   └── globals.css            # Tailwind + components
├── components/
│   ├── Navbar.jsx             # Sticky responsive nav with mobile menu
│   ├── Footer.jsx             # Multi-column footer with internal links
│   └── Converter.jsx          # Client-side converter UI
├── lib/
│   ├── seo.js                 # buildMetadata() helper
│   ├── site.js                # Brand + SITE_URL constants
│   └── formats.js             # Conversion route catalogue
├── server/
│   ├── routes/convert.js      # Express API routes (upload, download, zip)
│   ├── services/imageService.js  # sharp + heic-convert pipeline
│   └── utils/validation.js    # Limits, MIME/ext whitelists, sanitize
├── public/                    # Favicon, OG image
├── server.js                  # Express custom server bootstraps Next.js
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
├── .dockerignore
├── railway.json
└── package.json
```

---

## 🚀 Local Development

```bash
# 1. Install
npm install

# 2. Dev server (Express + Next, hot reload)
npm run dev

# 3. Open
open http://localhost:3000
```

> The dev server is `node server.js` with `NODE_ENV=development`, Express handles `/api/*` and Next.js handles everything else.

### Production build locally

```bash
npm run build
npm start
```

---

## 🐳 Docker

```bash
docker build -t pixelmorph .
docker run --rm -p 8080:8080 -e NEXT_PUBLIC_SITE_URL=https://your-domain.com pixelmorph
```

The container listens on `process.env.PORT` (default `8080`), so it works directly on Railway, Fly.io, Render, and any other Docker-friendly host.

---

## 🚂 Deploy to Railway

1. Push this repo to GitHub.
2. In Railway, **New Project → Deploy from GitHub repo** and pick this repo.
3. Railway will detect the `Dockerfile` automatically (config in `railway.json`).
4. Set environment variables (see below).
5. Open the generated domain, done.

### Required environment variables

| Variable                | Required | Notes                                                            |
| ----------------------- | -------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | yes      | Your public canonical URL, e.g. `https://pixelmorph.app`. Used for OG, canonical, sitemap. |
| `PORT`                  | no       | Set automatically by Railway. Locally defaults to `3000`.        |
| `NODE_ENV`              | no       | `production` by default in the Dockerfile.                       |

### Health check

Railway is configured to hit `GET /healthz`, which returns `{ "ok": true, "service": "pixelmorph" }`.

---

## 📡 API Reference

All endpoints are under `/api`.

### `POST /api/convert`

Multipart form upload.

| Field          | Type                | Description                                                                |
| -------------- | ------------------- | -------------------------------------------------------------------------- |
| `files`        | file[]              | One or more images (`.jpg/.jpeg/.png/.webp/.heic/.heif`). Max 25 / 25MB.   |
| `format`       | `jpg`\|`png`\|`webp`| Target output format.                                                       |
| `quality`      | int (1–100)         | JPG / WEBP quality. Default `82`.                                          |
| `width`        | int                 | Optional max width.                                                        |
| `height`       | int                 | Optional max height.                                                       |
| `fit`          | bool                | `true` = inside (preserve aspect, default), `false` = cover.               |
| `stripMetadata`| bool                | `true` (default) = remove EXIF/GPS.                                        |

Response:

```json
{
  "ok": true,
  "jobId": "abc123…",
  "targetFormat": "jpg",
  "files": [
    { "id": "…", "status": "ok", "originalName": "IMG_0001.HEIC",
      "originalSize": 2456789, "outputName": "IMG_0001.jpg", "outputSize": 412332 }
  ]
}
```

### `GET /api/download/:jobId/:fileId`

Returns the converted file as an attachment.

### `GET /api/download-zip/:jobId`

Returns a ZIP of all successful files in the job.

### `GET /healthz`

Liveness check. Returns `200 { ok: true }`.

> Jobs are stored in memory and **auto-expire after 15 minutes**. Files are never written to disk.

---

## 🧠 HEIC Notes

`sharp`’s prebuilt binaries do **not** include HEIF/HEIC support on Linux. PixelMorph solves this by piping HEIC/HEIF input through `heic-convert` (a pure-JS / WASM decoder) into a PNG buffer, then handing it to `sharp` for the final encode. This means:

- ✅ HEIC works in Linux containers (Railway, Docker, Alpine-free Debian)
- ✅ Works without `libheif` system packages
- ✅ Orientation is preserved (`sharp.rotate()` honors EXIF then strips it)

If you ever switch to a `sharp` build with native HEIF support, you can simplify `server/services/imageService.js` accordingly.

---

## 🔍 SEO Notes

- Every page declares its own `title`, `description`, canonical URL, OG and Twitter card metadata via the `buildMetadata()` helper in `lib/seo.js`.
- `app/sitemap.js` outputs a fully populated `/sitemap.xml`.
- `app/robots.js` outputs a `/robots.txt` that allows crawling and points to the sitemap.
- Home page exposes a `WebApplication` JSON-LD; FAQ page exposes a `FAQPage` JSON-LD with all questions/answers.
- All pages render on the server (RSC) so content is fully indexable, not a JS-only shell.
- Internal links cross-reference the converter, formats, FAQ, privacy and terms pages.

Set `NEXT_PUBLIC_SITE_URL` to your real domain before going live so canonicals and OG images use the right host.

---

## ♿ Accessibility

- Semantic HTML throughout (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<dl>`).
- Keyboard-navigable nav, mobile menu with `aria-expanded`, focus rings on all controls.
- File input is visually hidden but accessible via the visible "browse" button and drop zone.
- Color contrast follows WCAG AA on the brand palette.

---

## 🛠️ Troubleshooting

**`sharp` install fails on `npm install`**
The Dockerfile installs `python3 / make / g++` so `sharp` can rebuild if no prebuilt binary exists for your platform. Locally on Linux/macOS/Windows it should pull a prebuilt binary, make sure you’re on Node 18.18+.

**HEIC files fail to convert**
Check the file isn’t actually a misnamed JPG. The pipeline detects HEIC by extension (`.heic`/`.heif`) and MIME type, then falls back to `heic-convert`. Genuinely corrupted HEICs will return `{"status":"error"}` for that file without breaking the rest of the batch.

**404 / job expired on download**
Jobs are in-memory and last 15 minutes. Re-run the conversion to get a fresh `jobId`. (For multi-replica deploys, swap the in-memory store in `server/routes/convert.js` for shared storage like S3 or Redis.)

**Wrong canonical URL**
Set `NEXT_PUBLIC_SITE_URL` in your environment.

---

## 📄 License

MIT, do whatever you want, just don’t blame us.
