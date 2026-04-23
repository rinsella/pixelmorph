/* eslint-disable no-console */
const express = require('express');
const next = require('next');
const path = require('path');
const fs = require('fs');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';

const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

async function main() {
  await nextApp.prepare();

  const app = express();

  // Trust proxy (Railway / load balancers)
  app.set('trust proxy', 1);

  // Lightweight security headers
  app.use((req, res, nextMw) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    nextMw();
  });

  // Health check for Railway / uptime monitors
  app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'pixelmorph' }));

  // Ensure temp dir exists (ephemeral on Railway, that's fine)
  const tmpDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  // API routes (Express)
  app.use('/api', require('./server/routes/convert'));

  // Everything else -> Next.js
  app.all('*', (req, res) => handle(req, res));

  app.listen(port, hostname, () => {
    console.log(`> PixelMorph ready on http://${hostname}:${port}`);
  });
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
