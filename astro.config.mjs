import { defineConfig } from 'astro/config';

// SITE and BASE are set by the Pages workflow; locally the site runs at the root.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.github.io',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
