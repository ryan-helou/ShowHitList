// Serves the built hit list. Open to anyone with the link; set ACCESS_TOKEN to require ?k=<token> again.
import http from 'node:http';
import fs from 'node:fs';
const TOKEN = process.env.ACCESS_TOKEN;
const PORT = process.env.PORT || 3000;
const page = () => fs.readFileSync(new URL('./public/index.html', import.meta.url));
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/health') return res.end('ok');
  const cookie = /(?:^|;\s*)k=([^;]+)/.exec(req.headers.cookie || '')?.[1];
  const given = url.searchParams.get('k') || cookie;
  if (TOKEN && given !== TOKEN) { res.writeHead(401, { 'content-type': 'text/plain' }); return res.end('Private page.'); }
  const headers = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
  if (TOKEN && url.searchParams.get('k')) headers['set-cookie'] = `k=${TOKEN}; Max-Age=31536000; Path=/; HttpOnly; Secure; SameSite=Lax`;
  res.writeHead(200, headers); res.end(page());
}).listen(PORT, () => console.log('listening', PORT));
