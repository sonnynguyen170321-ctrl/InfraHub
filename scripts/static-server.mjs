// scripts/static-server.mjs
//
// Serves the built client output for browser tests.
//
// The production deployment is Vercel with cleanUrls, so /ip-transit is served from
// dist/client/ip-transit/index.html. This server reproduces that mapping — and only that —
// so the e2e suite exercises the same URLs the deployed site uses. It is a test fixture, not
// a production server: no caching, no compression, no range requests.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../dist/client');
const PORT = Number(process.env.PORT || 4331);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

/** Resolve a request path to a file on disk, or null when nothing matches. */
function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const relative = decoded.replace(/^\/+/, '');
  const candidate = path.resolve(ROOT, relative);

  // Never serve outside the build output.
  if (!candidate.startsWith(ROOT)) return null;

  const attempts = [
    candidate,
    path.join(candidate, 'index.html'),
    candidate + '.html'
  ];

  for (const attempt of attempts) {
    if (fs.existsSync(attempt) && fs.statSync(attempt).isFile()) return attempt;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url || '/');

  if (!file) {
    const notFound = path.join(ROOT, '404.html');
    const body = fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found';
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(body);
    return;
  }

  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`static-server: serving ${ROOT} on http://localhost:${PORT}`);
});
