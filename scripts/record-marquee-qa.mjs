import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outDir = 'C:\\Users\\admin\\.gemini\\antigravity-ide\\brain\\59bb71f2-89e1-4deb-90e2-cc893e02b18b\\videos';
fs.mkdirSync(outDir, { recursive: true });

async function recordQA() {
  console.log('Launching browser for marquee video QA...');
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1440x900 full loop (~55s)
  console.log('Recording desktop video (55s, full seamless loop)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: outDir,
      size: { width: 1440, height: 900 }
    }
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:4321', { waitUntil: 'networkidle' });
  await desktopPage.locator('.partner-trust-ribbon').scrollIntoViewIfNeeded();
  
  // Wait 55 seconds to capture more than 1 full complete loop (duration ~52.5s)
  console.log('Observing loop for 55 seconds...');
  await desktopPage.waitForTimeout(55000);
  
  const videoDesktop = desktopPage.video();
  await desktopContext.close();
  const desktopVideoPath = await videoDesktop.path();
  const targetDesktopVideo = path.join(outDir, 'marquee-desktop-full-loop.webm');
  if (fs.existsSync(targetDesktopVideo)) fs.unlinkSync(targetDesktopVideo);
  fs.renameSync(desktopVideoPath, targetDesktopVideo);
  console.log('Desktop video saved:', targetDesktopVideo);

  // 2. Mobile movement (390x844)
  console.log('Recording mobile video (15s)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: {
      dir: outDir,
      size: { width: 390, height: 844 }
    }
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:4321', { waitUntil: 'networkidle' });
  await mobilePage.locator('.partner-trust-ribbon').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(15000);
  
  const videoMobile = mobilePage.video();
  await mobileContext.close();
  const mobileVideoPath = await videoMobile.path();
  const targetMobileVideo = path.join(outDir, 'marquee-mobile-movement.webm');
  if (fs.existsSync(targetMobileVideo)) fs.unlinkSync(targetMobileVideo);
  fs.renameSync(mobileVideoPath, targetMobileVideo);
  console.log('Mobile video saved:', targetMobileVideo);

  // 3. Reduced motion state (static row)
  console.log('Recording reduced motion video (8s)...');
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    recordVideo: {
      dir: outDir,
      size: { width: 1440, height: 900 }
    }
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto('http://localhost:4321', { waitUntil: 'networkidle' });
  await rmPage.locator('.partner-trust-ribbon').scrollIntoViewIfNeeded();
  await rmPage.waitForTimeout(8000);

  const videoRm = rmPage.video();
  await rmContext.close();
  const rmVideoPath = await videoRm.path();
  const targetRmVideo = path.join(outDir, 'marquee-reduced-motion.webm');
  if (fs.existsSync(targetRmVideo)) fs.unlinkSync(targetRmVideo);
  fs.renameSync(rmVideoPath, targetRmVideo);
  console.log('Reduced motion video saved:', targetRmVideo);

  await browser.close();
  console.log('All QA video recordings finished successfully!');
}

recordQA().catch(err => {
  console.error('Video recording failed:', err);
  process.exit(1);
});
