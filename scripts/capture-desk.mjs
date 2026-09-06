import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const base = process.env.BASE || 'http://localhost:4399';
const out = path.resolve('screenshots');
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(`${base}/lets-talk`, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(out, `desk-${viewport.name}-start.png`), fullPage: true });

  await page.locator('[data-scope="connectivity"]').click();
  await page.getByRole('button', { name: 'IP Transit', exact: true }).click();
  await page.locator('#targetLocation').fill('Frankfurt');
  await page.getByRole('button', { name: '100G', exact: true }).click();
  await page.getByRole('button', { name: 'Yes', exact: true }).click();
  await page.locator('#requirementsDescription').fill('Two upstreams with separate physical paths');
  await page.locator('#timeline').selectOption('1-3-months');
  await page.screenshot({ path: path.join(out, `desk-${viewport.name}-brief.png`), fullPage: true });

  await page.locator('#continue-to-contact').click();
  await page.screenshot({ path: path.join(out, `desk-${viewport.name}-contact.png`), fullPage: true });
  await context.close();
}

await browser.close();
console.log(`Desk states written to ${out}`);
