import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../../dist/client');
const ARTIFACTS_DIR = path.resolve(__dirname, '../../test-results/audit');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

// Playwright comes from this project's own devDependency. The previous absolute import
// pointed at another checkout on one machine, so this audit could not run anywhere else.
import { chromium } from '@playwright/test';

// Simple static file server
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:4321');
  let pathname = url.pathname;
  if (!pathname.endsWith('/') && !path.extname(pathname)) {
    res.writeHead(301, { Location: pathname + '/' });
    return res.end();
  }
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }


  const filePath = path.join(DIST_DIR, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const notFoundPath = path.join(DIST_DIR, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      fs.createReadStream(notFoundPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
});

await new Promise(resolve => server.listen(0, resolve));
const port = server.address().port;
const BASE_URL = `http://localhost:${port}`;
console.log(`Local static audit server listening on ${BASE_URL}`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const auditResults = {
  headerLogo: {},
  partnerRibbon: [],
  partnerLedger: [],
  profilePages: [],
  invisibleTextFindings: [],
  screenshotsTaken: []
};

try {
  // 1. Audit Homepage Header Logo & Alignment
  console.log('\n--- 1. Auditing Header Brand Logo Alignment ---');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

  const headerBox = await page.locator('.site-header').boundingBox();
  const logoBox = await page.locator('.site-header .brand-logo').boundingBox();
  const markBox = await page.locator('.site-header .brand-mark svg').boundingBox();
  const wordmarkBox = await page.locator('.site-header .brand-wordmark').boundingBox();
  const firstNavLinkBox = await page.locator('.site-header .nav-link').first().boundingBox();
  const ctaBox = await page.locator('.site-header .btn-nav-cta').boundingBox();

  const markCenterY = markBox.y + markBox.height / 2;
  const wordmarkCenterY = wordmarkBox.y + wordmarkBox.height / 2;
  const logoCenterY = logoBox.y + logoBox.height / 2;
  const headerCenterY = headerBox.y + headerBox.height / 2;
  const navLinkCenterY = firstNavLinkBox.y + firstNavLinkBox.height / 2;
  const ctaCenterY = ctaBox.y + ctaBox.height / 2;

  auditResults.headerLogo = {
    headerCenterY,
    logoCenterY,
    markCenterY,
    wordmarkCenterY,
    navLinkCenterY,
    ctaCenterY,
    markWordmarkDelta: Math.abs(markCenterY - wordmarkCenterY),
    logoHeaderDelta: Math.abs(logoCenterY - headerCenterY),
    logoNavDelta: Math.abs(logoCenterY - navLinkCenterY)
  };

  console.log(`Header vertical center: ${headerCenterY.toFixed(2)}px`);
  console.log(`Logo Mark vertical center: ${markCenterY.toFixed(2)}px`);
  console.log(`Wordmark vertical center: ${wordmarkCenterY.toFixed(2)}px`);
  console.log(`Nav Link vertical center: ${navLinkCenterY.toFixed(2)}px`);
  console.log(`CTA Button vertical center: ${ctaCenterY.toFixed(2)}px`);
  console.log(`Mark vs Wordmark delta: ${auditResults.headerLogo.markWordmarkDelta.toFixed(2)}px`);
  console.log(`Logo vs Nav Link delta: ${auditResults.headerLogo.logoNavDelta.toFixed(2)}px`);


  const headerElem = page.locator('.site-header');
  const headerScreenshotPath = path.join(ARTIFACTS_DIR, 'audit_header.png');
  await headerElem.screenshot({ path: headerScreenshotPath });
  auditResults.screenshotsTaken.push(headerScreenshotPath);

  // 2. Audit Partner Trust Ribbon on Homepage
  console.log('\n--- 2. Auditing Partner Trust Ribbon ---');
  const ribbonPartners = await page.$$eval('.primary-track .partner-item', items => {
    return items.map(item => {
      const img = item.querySelector('img');
      const textMark = item.querySelector('.partner-text-mark');
      const link = item.querySelector('a');
      const rect = item.getBoundingClientRect();
      return {
        href: link ? link.getAttribute('href') : null,
        name: img ? img.getAttribute('alt') : (textMark ? textMark.innerText : null),
        hasImg: !!img,
        src: img ? img.getAttribute('src') : null,
        naturalWidth: img ? img.naturalWidth : null,
        naturalHeight: img ? img.naturalHeight : null,
        renderedWidth: rect.width,
        renderedHeight: rect.height
      };
    });
  });

  auditResults.partnerRibbon = ribbonPartners;
  ribbonPartners.forEach(p => {
    console.log(`Ribbon item: ${p.name || p.href} | Img: ${p.hasImg} (${p.naturalWidth}x${p.naturalHeight}) | Rendered: ${p.renderedWidth.toFixed(1)}x${p.renderedHeight.toFixed(1)}px`);
  });

  const ribbonElem = page.locator('.partner-trust-ribbon');
  const ribbonScreenshotPath = path.join(ARTIFACTS_DIR, 'audit_ribbon.png');
  await ribbonElem.screenshot({ path: ribbonScreenshotPath });
  auditResults.screenshotsTaken.push(ribbonScreenshotPath);

  // 3. Audit /partners page
  console.log('\n--- 3. Auditing /partners Ledger Page ---');
  await page.goto(`${BASE_URL}/partners`, { waitUntil: 'networkidle' });

  const ledgerPartners = await page.$$eval('.ledger-row-item', cards => {
    return cards.map(card => {
      const titleElem = card.querySelector('.partner-title');
      const roleElem = card.querySelector('.partner-short-role');
      const img = card.querySelector('.ledger-partner-logo');
      const textMark = card.querySelector('.ledger-text-logo');
      const extLink = card.querySelector('.partner-ext-link');
      return {
        title: titleElem ? titleElem.innerText.trim() : null,
        role: roleElem ? roleElem.innerText.trim() : null,
        hasImg: !!img,
        imgSrc: img ? img.getAttribute('src') : null,
        naturalWidth: img ? img.naturalWidth : null,
        naturalHeight: img ? img.naturalHeight : null,
        hasTextMark: !!textMark,
        textMarkText: textMark ? textMark.innerText : null,
        extText: extLink ? extLink.innerText.trim() : null
      };
    });
  });

  auditResults.partnerLedger = ledgerPartners;
  ledgerPartners.forEach(p => {
    console.log(`Ledger partner: "${p.title}" | Img: ${p.hasImg ? p.imgSrc : p.textMarkText} (${p.naturalWidth}x${p.naturalHeight}) | Role: ${p.role}`);
  });

  const ledgerScreenshotPath = path.join(ARTIFACTS_DIR, 'audit_partners_ledger.png');
  await page.screenshot({ path: ledgerScreenshotPath, fullPage: true });
  auditResults.screenshotsTaken.push(ledgerScreenshotPath);

  // 4. Audit All 8 Partner Profile Pages
  const partnerSlugs = ['fastnetmon', 'gcore', 'stormwall', 'zenlayer', 'ipxo', 'vates', 'itcare', 'airframe'];
  console.log('\n--- 4. Auditing Partner Profile Pages ---');
  for (const slug of partnerSlugs) {
    await page.goto(`${BASE_URL}/partners/${slug}/`, { waitUntil: 'networkidle' });
    
    const profileData = await page.evaluate(() => {
      const h1 = document.querySelector('.profile-title');
      const tagline = document.querySelector('.profile-tagline');
      const img = document.querySelector('.profile-logo-img');
      const textMark = document.querySelector('.profile-text-mark');
      return {
        h1Text: h1 ? h1.innerText : null,
        taglineText: tagline ? tagline.innerText : null,
        hasImg: !!img,
        imgSrc: img ? img.getAttribute('src') : null,
        imgNatWidth: img ? img.naturalWidth : null,
        imgNatHeight: img ? img.naturalHeight : null,
        hasTextMark: !!textMark,
        textMarkText: textMark ? textMark.innerText : null
      };
    });

    auditResults.profilePages.push({ slug, ...profileData });
    console.log(`Profile ${slug.padEnd(12)}: H1="${profileData.h1Text}", Logo=${profileData.hasImg ? profileData.imgSrc : profileData.textMarkText} (${profileData.imgNatWidth}x${profileData.imgNatHeight})`);

    const profileHeader = page.locator('.profile-header');
    const profileScreenshotPath = path.join(ARTIFACTS_DIR, `audit_profile_${slug}.png`);
    await profileHeader.screenshot({ path: profileScreenshotPath });
    auditResults.screenshotsTaken.push(profileScreenshotPath);
  }

  // 5. Global invisible/unappearable text scan across pages
  console.log('\n--- 5. Scanning for Low Contrast / Invisible Text ---');
  const pagesToScan = [`${BASE_URL}/`, `${BASE_URL}/partners`, `${BASE_URL}/offers`, `${BASE_URL}/how-we-work`, `${BASE_URL}/lets-talk`];
  
  for (const pageUrl of pagesToScan) {
    await page.goto(pageUrl, { waitUntil: 'networkidle' });
    const pageIssues = await page.evaluate((url) => {
      const all = document.querySelectorAll('p, h1, h2, h3, h4, span, a, li');
      const issues = [];
      all.forEach(el => {
        if (!el.innerText || el.innerText.trim().length === 0) return;
        const style = window.getComputedStyle(el);
        const color = style.color;
        const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
          const [r, g, b] = [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
          // Check white on white
          if (r > 240 && g > 240 && b > 240) {
            let parent = el;
            let bgIsWhite = false;
            while (parent && parent !== document.body) {
              const parentBg = window.getComputedStyle(parent).backgroundColor;
              const bgMatch = parentBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]+))?/);
              if (bgMatch) {
                const alpha = bgMatch[4] !== undefined ? parseFloat(bgMatch[4]) : 1;
                if (alpha > 0.5) {
                  const [br, bg2, bb] = [parseInt(bgMatch[1]), parseInt(bgMatch[2]), parseInt(bgMatch[3])];
                  if (br > 230 && bg2 > 230 && bb > 230) {
                    bgIsWhite = true;
                  }
                  break;
                }
              }
              parent = parent.parentElement;
            }
            if (bgIsWhite) {
              issues.push({
                url,
                tag: el.tagName,
                text: el.innerText.slice(0, 40),
                color
              });
            }
          }
        }
      });
      return issues;
    }, pageUrl);

    auditResults.invisibleTextFindings.push(...pageIssues);
  }

  if (auditResults.invisibleTextFindings.length === 0) {
    console.log('✓ No white-on-white or invisible text detected across pages!');
  } else {
    console.warn(`WARNING: Found ${auditResults.invisibleTextFindings.length} potentially invisible text elements:`, auditResults.invisibleTextFindings);
  }

} finally {
  await browser.close();
  server.close();
}

console.log('\n======================================================');
console.log('PLAYWRIGHT USER FORENSIC AUDIT SUMMARY');
console.log('======================================================');
console.log('Header Brand Mark vs Wordmark Delta:', auditResults.headerLogo.markWordmarkDelta?.toFixed(2) + 'px (Target: < 0.5px)');
console.log('Partner Ribbon Logos checked:', auditResults.partnerRibbon.length);
console.log('Partner Ledger Cards checked:', auditResults.partnerLedger.length);
console.log('Partner Profile Pages verified:', auditResults.profilePages.length);
console.log('Invisible Text Violations:', auditResults.invisibleTextFindings.length);
console.log('Total Screenshots Captured:', auditResults.screenshotsTaken.length);
console.log('======================================================\n');
