const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

process.on('uncaughtException', (err) => {
  console.error('[Server] Handled error:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled rejection:', reason);
});
const PORT = process.env.PORT || 5173;
const ROOT = __dirname;
const REMOTE_ORIGIN = 'https://www.jameschugh.com';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = path.join(ROOT, pathname);

  // Security check: ensure path is within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

        if (isNaN(start) || isNaN(end) || start > end || start >= stats.size) {
          res.writeHead(416, {
            'Content-Range': `bytes */${stats.size}`,
            'Access-Control-Allow-Origin': '*'
          });
          res.end();
          return;
        }

        const chunksize = (end - start) + 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // If file doesn't exist locally, check if it's an asset (v2/... or _vercel/...) or API endpoint
    if (pathname.startsWith('/v2/') || pathname.startsWith('/_vercel/') || pathname.startsWith('/api/')) {
      const remoteUrl = `${REMOTE_ORIGIN}${pathname}`;
      https.get(remoteUrl, (remoteRes) => {
        if (remoteRes.statusCode === 200) {
          const ext = path.extname(pathname).toLowerCase();
          const contentType = remoteRes.headers['content-type'] || MIME_TYPES[ext] || 'application/octet-stream';

          res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=86400'
          });

          // Also save to disk locally so subsequent requests are instant
          fs.mkdir(path.dirname(filePath), { recursive: true }, () => {
            const fileStream = fs.createWriteStream(filePath);
            remoteRes.pipe(fileStream);
          });

          remoteRes.pipe(res);
        } else {
          if (!res.headersSent) {
            res.writeHead(remoteRes.statusCode || 404);
            res.end('Not Found');
          }
        }
      }).on('error', () => {
        if (!res.headersSent) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.destroy();
        }
      });
      return;
    }

    // Fallback to index.html for client-side deep links
    const indexPath = path.join(ROOT, 'index.html');
    fs.readFile(indexPath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Portfolio Clone is running!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
