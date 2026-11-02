// Technical SEO and brand-voice checks over the built site. Run after `astro build`: node scripts/seo-check.mjs dist
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const BANNED = ['revolutionise', 'revolutionize', 'seamless', 'cutting-edge', 'unlock', 'empower', 'next-generation'];
const problems = [];
const fail = (file, msg) => problems.push(`${file}: ${msg}`);

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const pages = walk(dist).filter((f) => f.endsWith('.html'));
const one = (html, re) => (html.match(re) ?? [])[1];
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

const titles = new Map(), descriptions = new Map(), canonicals = [];
for (const file of pages) {
  const rel = relative(dist, file);
  const html = readFileSync(file, 'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').toLowerCase();

  const title = one(html, /<title>([^<]*)<\/title>/);
  if (!title) fail(rel, 'missing <title>');
  else if (title.length > 60) fail(rel, `title is ${title.length} chars (max 60)`);
  if (title && titles.has(title)) fail(rel, `duplicate title also on ${titles.get(title)}`);
  titles.set(title, rel);

  const desc = one(html, /<meta name="description" content="([^"]*)"/);
  if (!desc) fail(rel, 'missing meta description');
  else if (desc.length < 70 || desc.length > 160) fail(rel, `meta description is ${desc.length} chars (70-160)`);
  if (desc && descriptions.has(desc)) fail(rel, `duplicate description also on ${descriptions.get(desc)}`);
  descriptions.set(desc, rel);

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(rel, `has ${h1s} <h1> elements (want 1)`);

  const canonical = one(html, /<link rel="canonical" href="([^"]+)"/);
  if (!canonical) fail(rel, 'missing canonical'); else canonicals.push(canonical);
  for (const p of ['og:title', 'og:description', 'og:url']) {
    if (!html.includes(`property="${p}"`)) fail(rel, `missing ${p}`);
  }

  const ld = all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  for (const block of ld) {
    try { JSON.parse(block); } catch { fail(rel, 'JSON-LD does not parse'); }
  }
  const types = ld.flatMap((b) => { try { return [JSON.parse(b)['@type']]; } catch { return []; } });
  if (rel === 'index.html' && !types.includes('Organization')) fail(rel, 'home page needs Organization JSON-LD');
  if (html.includes('<details') && !types.includes('FAQPage')) fail(rel, 'page has an FAQ but no FAQPage JSON-LD');
  if (rel.startsWith('labs/') && !types.includes('Course')) fail(rel, 'lab page needs Course JSON-LD');

  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (!/\salt="/.test(img)) fail(rel, `<img> without alt: ${img.slice(0, 60)}`);

  for (const href of all(html, /href="([^"#?]+)/g)) {
    if (/^(https?:|mailto:)/.test(href)) continue;
    const base = process.env.BASE_PATH ?? '/';
    const path = href.startsWith(base) ? href.slice(base.length) : href.replace(/^\//, '');
    const target = join(dist, path, path === '' || path.endsWith('/') ? 'index.html' : '');
    if (!existsSync(target)) fail(rel, `broken internal link ${href}`);
  }

  for (const word of BANNED) if (text.includes(word)) fail(rel, `brand voice: avoid "${word}"`);
}

const sitemap = existsSync(join(dist, 'sitemap.xml')) ? readFileSync(join(dist, 'sitemap.xml'), 'utf8') : '';
if (!sitemap) fail('sitemap.xml', 'missing');
for (const c of canonicals) if (!sitemap.includes(`<loc>${c}</loc>`)) fail('sitemap.xml', `does not list ${c}`);
const robots = existsSync(join(dist, 'robots.txt')) ? readFileSync(join(dist, 'robots.txt'), 'utf8') : '';
if (!/Sitemap: \S+sitemap\.xml/.test(robots)) fail('robots.txt', 'missing Sitemap line');

if (problems.length) {
  console.error(`SEO check failed (${problems.length}):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`SEO check passed: ${pages.length} pages, sitemap and robots.txt OK`);
