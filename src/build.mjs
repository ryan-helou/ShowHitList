// Builds public/index.html from data/scored.json (the scored hit list) and src/template.html.
// Card Ladder price = mean of the card's last 3 counted Card Ladder sales (USD; C$ shown at the app's rate).
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(new URL('../data/scored.json', import.meta.url), 'utf8'));
d.fx = 1.4; // Card Ladder's app shows CAD; its $5,786.31 Shiftry sale is US$4,133.08 (1.40)
d.rows = d.rows.filter(r => !(r.gap != null && r.gap > 3) && !/Celebrations Collection/.test(r.name));
for (const r of d.rows) {
  for (const k of ['img', 'image', 'feedSales', 'ebaySold', 'collectr', 'median', 'count', 'err', 'titleNow', 'certNow', 'bidNow', 'bidsNow', 'cl']) delete r[k];
  const l3 = r.sales.filter(s => !s.held).slice(0, 3);
  r.clN = l3.length;
  r.clPrice = l3.length ? l3.reduce((a, s) => a + s.price, 0) / l3.length : null;
}
d.checkedText = new Date(d.checkedAt || Date.now()).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto' }) + ' ET';
const body = fs.readFileSync(new URL('./template.html', import.meta.url), 'utf8').replace('__DATA__', JSON.stringify(d));
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Show Hit List</title></head><body>
${body}
</body></html>`;
fs.mkdirSync(new URL('../public', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../public/index.html', import.meta.url), html);
console.log('built', d.rows.length, 'cards,', d.rows.filter(r => r.solid).length, 'solid,', d.rows.filter(r => r.clPrice).length, 'with a Card Ladder price');
