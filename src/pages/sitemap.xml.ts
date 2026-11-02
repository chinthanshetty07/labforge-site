import type { APIRoute } from 'astro';
import labs from '../data/labs.json';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const paths = ['', ...labs.map((l) => `labs/${l.slug}/`)];
  const urls = paths.map((p) => `  <url><loc>${new URL(base + p, site).href}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } });
};
