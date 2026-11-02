// Proves the SEO checker fails on broken pages, not just that it passes on good ones: node --test scripts/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const good = (title, desc) => `<html><head><title>${title}</title><meta name="description" content="${desc}">
<link rel="canonical" href="https://x.test/"><meta property="og:title" content="t"><meta property="og:description" content="d">
<meta property="og:url" content="u"><script type="application/ld+json">{"@type":"Organization"}</script></head><body><h1>Hi</h1></body></html>`;
const DESC = 'A description that is long enough to pass the seventy character minimum length check.';

function site(files) {
  const dir = mkdtempSync(join(tmpdir(), 'seo-'));
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), body);
  }
  return spawnSync('node', ['scripts/seo-check.mjs', dir], { encoding: 'utf8' });
}
const sitemapFor = (...locs) => `<urlset>${locs.map((l) => `<url><loc>${l}</loc></url>`).join('')}</urlset>`;
const ROBOTS = 'User-agent: *\nSitemap: https://x.test/sitemap.xml\n';

test('passes a correct page', () => {
  const r = site({ 'index.html': good('Home', DESC), 'sitemap.xml': sitemapFor('https://x.test/'), 'robots.txt': ROBOTS });
  assert.equal(r.status, 0, r.stderr);
});

test('fails on two h1s, a banned word and a missing sitemap entry', () => {
  const page = good('Home', DESC).replace('<h1>Hi</h1>', '<h1>A</h1><h1>B</h1><p>Unlock seamless learning</p>');
  const r = site({ 'index.html': page, 'sitemap.xml': sitemapFor(), 'robots.txt': ROBOTS });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /has 2 <h1>/);
  assert.match(r.stderr, /avoid "seamless"/);
  assert.match(r.stderr, /avoid "unlock"/);
  assert.match(r.stderr, /does not list https:\/\/x.test\//);
});

test('fails on a short description, broken JSON-LD and a broken link', () => {
  const page = good('Home', 'Too short').replace('{"@type":"Organization"}', '{oops').replace('<h1>Hi</h1>', '<h1>Hi</h1><a href="/missing/">x</a>');
  const r = site({ 'index.html': page, 'sitemap.xml': sitemapFor('https://x.test/'), 'robots.txt': ROBOTS });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /meta description is 9 chars/);
  assert.match(r.stderr, /JSON-LD does not parse/);
  assert.match(r.stderr, /broken internal link \/missing\//);
});
