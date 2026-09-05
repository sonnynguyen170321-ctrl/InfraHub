import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  compressHTML: true,
  adapter: vercel({
    // Vercel Analytics serves /_vercel/insights/script.js, which only exists on Vercel.
    // Injecting it into a local build makes every page request a URL that 404s, which buries
    // real console errors in noise. On Vercel, VERCEL=1 is set and it is enabled as before.
    webAnalytics: { enabled: process.env.VERCEL === '1' }
  }),
  site: 'https://infrahub.tech',
  integrations: [
    sitemap({
      // Canonical links on the pages have no trailing slash; the sitemap said /about/ while
      // the page said /about. Two URLs for one page is exactly what a sitemap is meant to
      // prevent.
      serialize: (entry) => ({
        ...entry,
        url: entry.url.length > 'https://infrahub.tech/'.length ? entry.url.replace(/\/$/, '') : entry.url
      })
    })
  ]
});

