// scripts/verify-routes.mjs
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist/client');

if (!fs.existsSync(distDir)) {
  console.error(`Error: dist/client directory does not exist. Run "npm run build" first.`);
  process.exit(1);
}

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(distDir);
console.log(`Auditing ${htmlFiles.length} rendered HTML pages in dist/client...\n`);

let errors = [];
let auditedPages = 0;
const internalLinks = new Set();

for (const filePath of htmlFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(distDir, filePath).replace(/\\/g, '/');
  auditedPages++;

  // 1. Check SEO basics
  if (!content.includes('<title>')) {
    errors.push(`[${relPath}] Missing <title> tag.`);
  }
  if (!content.includes('name="description"')) {
    errors.push(`[${relPath}] Missing meta description tag.`);
  }
  if (!content.includes('rel="canonical"')) {
    errors.push(`[${relPath}] Missing canonical link tag.`);
  }

  // 2. Check layout integrity
  if (!content.includes('<header') || !content.includes('</header>')) {
    errors.push(`[${relPath}] Missing <header> element.`);
  }
  if (!content.includes('<footer') || !content.includes('</footer>')) {
    errors.push(`[${relPath}] Missing <footer> element.`);
  }

  // 3. Extract and verify internal links
  const hrefMatches = content.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g);
  for (const match of hrefMatches) {
    const linkPath = match[1];
    if (linkPath && !linkPath.startsWith('//') && !linkPath.startsWith('/_')) {
      internalLinks.add(linkPath);
    }
  }
}

console.log(`Verified ${auditedPages} HTML documents have valid SEO meta, header, and footer.`);
console.log(`Auditing ${internalLinks.size} unique internal links for target file existence...`);

// Verify all internal links point to an existing HTML file or asset
for (const link of internalLinks) {
  const cleanLink = link === '/' ? 'index.html' : link.replace(/^\//, '');
  const candidateHtml = path.join(distDir, cleanLink, 'index.html');
  const candidateDirect = path.join(distDir, cleanLink + '.html');
  const candidateFile = path.join(distDir, cleanLink);

  const exists = fs.existsSync(candidateHtml) || fs.existsSync(candidateDirect) || fs.existsSync(candidateFile);
  if (!exists) {
    errors.push(`Broken internal link: "${link}" does not resolve to an HTML file in dist/client.`);
  }
}

if (errors.length > 0) {
  console.error(`\nFAILED: Found ${errors.length} issues:`);
  for (const err of errors) {
    console.error(` - ${err}`);
  }
  process.exit(1);
} else {
  console.log(`\nSUCCESS: All ${auditedPages} pages and all ${internalLinks.size} internal links verified cleanly with zero broken links!`);
  process.exit(0);
}
