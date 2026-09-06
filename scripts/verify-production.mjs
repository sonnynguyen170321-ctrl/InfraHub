const base = new URL(process.env.BASE || 'https://infrahub.tech');
const canonicalOrigin = 'https://infrahub.tech';
const skipDomainRouting = process.env.SKIP_DOMAIN_ROUTING === '1';

const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (condition) {
    console.log(`PASS ${message}`);
    return;
  }

  failures.push(message);
  console.error(`FAIL ${message}`);
}

async function request(url, init = {}) {
  try {
    return await fetch(url, { signal: AbortSignal.timeout(15_000), ...init });
  } catch (error) {
    console.error(`ERROR ${url} was unreachable: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function canonicalFrom(html) {
  return html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]
    || html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1]
    || '';
}

if (!skipDomainRouting) {
  const httpApex = await request('http://infrahub.tech/', { redirect: 'manual' });
  check([301, 302, 307, 308].includes(httpApex?.status), 'HTTP apex redirects');
  check(httpApex?.headers.get('location') === `${canonicalOrigin}/`, 'HTTP apex redirects to HTTPS apex');

  const www = await request('https://www.infrahub.tech/', { redirect: 'manual' });
  check([301, 302, 307, 308].includes(www?.status), 'www redirects');
  check(www?.headers.get('location') === `${canonicalOrigin}/`, 'www redirects to the canonical apex');
}

const routes = [
  '/',
  '/lets-talk',
  '/solutions/network-connectivity',
  '/how-we-work',
  '/industries',
  '/insights'
];

for (const route of routes) {
  const url = new URL(route, base);
  const response = await request(url);
  check(response?.ok, `${route} returns a successful document`);
  if (!response) continue;

  const html = await response.text();
  const expectedCanonical = new URL(route, canonicalOrigin).href;
  check(canonicalFrom(html) === expectedCanonical, `${route} has the canonical URL ${expectedCanonical}`);
  check(!html.includes('Innovative Infrastructure Solutions'), `${route} excludes legacy GoDaddy copy`);

  if (route === '/') {
    check(html.includes('The right infrastructure'), 'homepage contains the redesigned value proposition');
    check(html.includes('Start a Requirement'), 'homepage exposes the requirement journey');
  }

  if (route === '/lets-talk') {
    check(html.includes('id="inquiry-form"'), 'Desk inquiry form is present');
    check(html.includes('InfraHub Desk'), 'Desk progressive builder is present');
  }
}

const root = await request(base);
if (root) {
  const headers = root.headers;
  check(headers.get('x-content-type-options')?.toLowerCase() === 'nosniff', 'X-Content-Type-Options is enforced');
  check(headers.get('x-frame-options')?.toUpperCase() === 'DENY', 'X-Frame-Options is enforced');
  check(headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy is enforced');
  check(headers.get('strict-transport-security')?.includes('max-age='), 'HSTS is enforced');
}

const robots = await request(new URL('/robots.txt', base));
const robotsText = robots ? await robots.text() : '';
check(robots?.ok, 'robots.txt is reachable');
check(robotsText.includes(`Sitemap: ${canonicalOrigin}/sitemap-index.xml`), 'robots.txt advertises the canonical sitemap');

const sitemap = await request(new URL('/sitemap-index.xml', base));
const sitemapText = sitemap ? await sitemap.text() : '';
check(sitemap?.ok, 'sitemap index is reachable');
check(
  Boolean(sitemap?.ok && sitemapText.includes('<sitemapindex') && sitemapText.includes(`<loc>${canonicalOrigin}/sitemap`)),
  'sitemap index is XML and uses the canonical origin'
);

console.log(`\n${checks - failures.length}/${checks} production smoke checks passed.`);
if (failures.length) {
  console.error(`${failures.length} check(s) failed.`);
  process.exit(1);
}
