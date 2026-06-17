const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 5177);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

function send(res, statusCode, body, contentType) {
  res.writeHead(statusCode, { 'Content-Type': contentType || 'text/plain; charset=utf-8' });
  res.end(body);
}

function serveFile(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname === '/' ? '/script.html' : decodeURIComponent(url.pathname);
  const filePath = path.resolve(root, `.${pathname}`);

  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, 'Not found');
      return;
    }

    const delay = Math.max(0, Number(url.searchParams.get('delay') || 0));
    const ext = path.extname(filePath);
    const contentType = contentTypes[ext] || 'application/octet-stream';

    setTimeout(() => {
      send(res, 200, data, contentType);
    }, delay);
  });
}

http.createServer(serveFile).listen(port, () => {
  console.log(`Open http://localhost:${port}/script.html`);
});
