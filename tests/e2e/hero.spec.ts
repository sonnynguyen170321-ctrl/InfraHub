import { test, expect, type Page } from '@playwright/test';
import sharp from 'sharp';

/**
 * The hero is a photograph with copy on it, so its two obligations pull against each other:
 * the facility has to be visible, and the text has to stay readable over it. These tests hold
 * both ends, because tuning one by eye is exactly how the previous version ended up applying
 * brightness(0.65) under a 94% black scrim and showing nothing at all.
 */

const srgb = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const relativeLuminance = (r: number, g: number, b: number) =>
  0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const contrastRatio = (a: number, b: number) =>
  (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const luminanceOfCssColor = (css: string) => {
  const match = css.match(/rgba?\(([^)]+)\)/);
  if (!match) throw new Error(`unparseable colour: ${css}`);
  const [r, g, b] = match[1].split(',').map((n) => parseFloat(n));
  return relativeLuminance(r, g, b);
};

/**
 * Per rendered line, not per element. A wrapped paragraph's box is as wide as its widest line,
 * so measuring the box charges the text for hundreds of background pixels no glyph covers.
 */
async function copyLineBoxes(page: Page) {
  return page.evaluate(() => {
    const selectors: Array<[string, string]> = [
      ['headline line 1', '.hero-line-1'],
      ['headline line 2', '.hero-line-2'],
      ['description', '.hero-description'],
      ['secondary action', '.hero-text-action span'],
    ];
    const out: Array<{ label: string; color: string; box: { x: number; y: number; w: number; h: number } }> = [];
    for (const [label, selector] of selectors) {
      const el = document.querySelector(selector);
      if (!el) continue;
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = Array.from(range.getClientRects()).filter((r) => r.width > 4 && r.height > 4);
      const color = getComputedStyle(el).color;
      rects.forEach((r, i) => {
        out.push({
          label: rects.length > 1 ? `${label} L${i + 1}` : label,
          color,
          box: {
            x: Math.max(0, Math.round(r.x)),
            y: Math.max(0, Math.round(r.y)),
            w: Math.round(r.width),
            h: Math.round(r.height),
          },
        });
      });
    }
    return out;
  });
}

test.describe('hero art direction', () => {
  test('every line of hero copy clears AA against its brightest background pixel', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForTimeout(2200); // the one-time reveal must have settled

    const lines = await copyLineBoxes(page);
    expect(lines.length).toBeGreaterThan(3);

    // Hiding the copy leaves the composited photograph, scrim and light field to sample.
    await page.addStyleTag({ content: '.hero-content{visibility:hidden !important}' });
    await page.waitForTimeout(150);
    const shot = await page.screenshot();

    const { data, info } = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const luminanceAt = (x: number, y: number) => {
      const i = (y * info.width + x) * info.channels;
      return relativeLuminance(data[i], data[i + 1], data[i + 2]);
    };

    const failures: string[] = [];
    for (const line of lines) {
      let brightest = 0;
      for (let y = line.box.y; y < Math.min(line.box.y + line.box.h, info.height); y += 2) {
        for (let x = line.box.x; x < Math.min(line.box.x + line.box.w, info.width); x += 2) {
          brightest = Math.max(brightest, luminanceAt(x, y));
        }
      }
      // The headline is large text (>= 24px bold), so AA is 3:1 there and 4.5:1 elsewhere.
      const minimum = line.label.startsWith('headline') ? 3 : 4.5;
      const ratio = contrastRatio(luminanceOfCssColor(line.color), brightest);
      if (ratio < minimum) {
        failures.push(`${line.label}: ${ratio.toFixed(2)}:1 (needs ${minimum}:1)`);
      }
    }

    testInfo.annotations.push({ type: 'lines measured', description: String(lines.length) });
    expect(failures, failures.join('\n')).toEqual([]);
  });

  test('the photograph is exposed to show the facility, not blacked out', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2200);

    const filter = await page.evaluate(
      () => getComputedStyle(document.querySelector('.hero-bg-img') as Element).filter
    );
    const brightness = Number(filter.match(/brightness\(([\d.]+)\)/)?.[1] ?? 0);
    expect(brightness).toBeGreaterThanOrEqual(0.85);

    // And the right side of the frame must actually carry visible detail rather than being
    // scrimmed flat. Compare the spread of luminance there against the copy zone.
    await page.addStyleTag({ content: '.hero-content{visibility:hidden !important}' });
    const shot = await page.screenshot({ clip: await page.evaluate(() => {
      const hero = document.getElementById('hero') as HTMLElement;
      const r = hero.getBoundingClientRect();
      return { x: Math.round(r.width * 0.62), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width * 0.3), height: Math.round(Math.min(r.height, window.innerHeight - Math.max(0, r.y))) };
    }) });

    const stats = await sharp(shot).greyscale().stats();
    // A flat black rectangle has a near-zero standard deviation; a lit rack wall does not.
    expect(stats.channels[0].stdev).toBeGreaterThan(12);
  });

  test('scroll drives one custom property and never touches scrim opacity', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('#hero');

    expect(Number(await hero.evaluate((el) => getComputedStyle(el).getPropertyValue('--hero-progress') || '0'))).toBe(0);

    const heroHeight = await hero.evaluate((el: HTMLElement) => el.offsetHeight);
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroHeight * 0.5));
    await page.waitForTimeout(300);

    const progress = Number(await hero.evaluate((el) => getComputedStyle(el).getPropertyValue('--hero-progress')));
    expect(progress).toBeGreaterThan(0.4);
    expect(progress).toBeLessThanOrEqual(1);

    // The old implementation set scrim opacity to 1 + progress * 0.45, which is meaningless
    // above 1 and darkened the photograph exactly where it should stay visible.
    const scrimInlineStyle = await page.locator('.hero-scrim').getAttribute('style');
    expect(scrimInlineStyle).toBeNull();

    // Exposure may only fall in the last third of the exit, and only slightly.
    await page.evaluate((y) => window.scrollTo(0, y), heroHeight);
    await page.waitForTimeout(300);
    const veil = Number(await page.locator('.hero-exit-veil').evaluate((el) => getComputedStyle(el).opacity));
    expect(veil).toBeLessThanOrEqual(0.11);
  });

  test('the hero stays short enough that the partner ecosystem is discoverable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    const heroHeight = await page.locator('#hero').evaluate((el: HTMLElement) => el.offsetHeight);
    // min-height beats max-height in CSS, so this guards the min(76dvh, 780px) form.
    expect(heroHeight).toBeLessThanOrEqual(780);
  });

  test('reduced motion gets the finished composition, not a lesser one', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForTimeout(400);

    const state = await page.evaluate(() => {
      const img = document.querySelector('.hero-bg-img') as HTMLElement;
      const camera = document.querySelector('.hero-camera') as HTMLElement;
      const trace = document.querySelector('.hero-light-trace') as HTMLElement;
      return {
        filter: getComputedStyle(img).filter,
        imageAnimation: getComputedStyle(img).animationName,
        cameraTransform: getComputedStyle(camera).transform,
        traceDisplay: getComputedStyle(trace).display,
        routeOpacity: getComputedStyle(document.querySelector('.hero-routing-exit') as Element).opacity,
      };
    });

    // Same exposure as everyone else: holding still must not cost image quality.
    expect(state.filter).toContain('brightness(0.92)');
    expect(state.imageAnimation).toBe('none');
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(state.cameraTransform);
    expect(state.traceDisplay).toBe('none');
    expect(Number(state.routeOpacity)).toBe(1);

    await expect(page.locator('.hero-description')).toBeVisible();
  });

  test('the light trace runs once and leaves nothing behind', async ({ page }) => {
    await page.goto('/');
    const trace = page.locator('.hero-light-trace');
    const iterations = await trace.evaluate((el) => getComputedStyle(el).animationIterationCount);
    expect(iterations).toBe('1');

    await page.waitForTimeout(2400);
    expect(Number(await trace.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThanOrEqual(0.01);
  });

  test('mobile is art-directed rather than centre-cropped from the desktop frame', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const objectPosition = await page.locator('.hero-bg-img').evaluate((el) => getComputedStyle(el).objectPosition);
    // Dead centre lands on the aisle's vanishing point, the darkest part of the room.
    expect(objectPosition).not.toContain('50%');
  });
});
