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

  /*
   * This asserted heroHeight <= 780 as a stand-in for "the ecosystem is discoverable". The two
   * came apart: the hero is now sized as the viewport less the header less the reveal, so on a
   * 1200px-tall window it is 1020px and still leaves the whole partner band above the fold,
   * while the old 780px cap left 220px of bare paper under that band at 1080. Assert the thing
   * the test is named after — what the visitor can see without scrolling — at several heights.
   */
  test('the partner ecosystem is above the fold, and sits tight to it', async ({ page }) => {
    for (const height of [768, 900, 1080, 1200]) {
      await page.setViewportSize({ width: 1440, height });
      await page.goto('/');

      const seen = await page.evaluate(() => {
        const ribbon = document.querySelector('.partner-trust-ribbon')!.getBoundingClientRect();
        return {
          visible: Math.max(0, Math.min(ribbon.bottom, innerHeight) - Math.max(ribbon.top, 0)),
          band: ribbon.height,
          gapBeneath: innerHeight - ribbon.bottom,
        };
      });

      // Essentially the whole band, not a token sliver of it.
      expect(seen.visible, `ribbon visible at ${height}px`).toBeGreaterThanOrEqual(seen.band - 4);
      // And no expanse of empty ground beneath it, which is the failure the old cap produced.
      expect(seen.gapBeneath, `gap beneath ribbon at ${height}px`).toBeLessThanOrEqual(48);
      expect(seen.gapBeneath, `gap beneath ribbon at ${height}px`).toBeGreaterThanOrEqual(0);
    }
  });

  test('reduced motion gets the finished composition, not a lesser one', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForTimeout(400);

    const state = await page.evaluate(() => {
      const img = document.querySelector('.hero-bg-img') as HTMLElement;
      const camera = document.querySelector('.hero-camera') as HTMLElement;
      return {
        filter: getComputedStyle(img).filter,
        imageAnimation: getComputedStyle(img).animationName,
        cameraTransform: getComputedStyle(camera).transform,
        routeOpacity: getComputedStyle(document.querySelector('.hero-routing-exit') as Element).opacity,
      };
    });

    // Same exposure as everyone else: holding still must not cost image quality.
    expect(state.filter).toContain('brightness(0.92)');
    expect(state.imageAnimation).toBe('none');
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(state.cameraTransform);
    expect(Number(state.routeOpacity)).toBe(1);

    await expect(page.locator('.hero-description')).toBeVisible();
  });

  test('mobile is art-directed rather than centre-cropped from the desktop frame', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const objectPosition = await page.locator('.hero-bg-img').evaluate((el) => getComputedStyle(el).objectPosition);
    // Dead centre lands on the aisle's vanishing point, the darkest part of the room.
    expect(objectPosition).not.toContain('50%');
  });
});

/**
 * The hero's primary call to action pointed at #solutions-ecosystem, an id that exists nowhere
 * in the source. Clicking it did nothing at all: no scroll, no navigation, no error. The
 * discovery section it was meant to reach is #discovery-stage.
 *
 * These assertions are deliberately about where the visitor ends up rather than about the
 * attribute alone, because a correct href that lands the reader under the sticky header, or
 * above the controls, is still a call to action that did not work.
 */
/**
 * Smooth scrolling has no completion event, so these tests used a fixed 900ms wait. That is
 * exactly the flake the project's testing rules warn about: it passed alone and failed under
 * two workers, where the scroll simply had not finished. Wait for the position to stop moving
 * instead of guessing how long it takes.
 */
async function scrollSettled(page: Page) {
  let last = -1;
  let stable = 0;
  for (let i = 0; i < 80; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (y === last) {
      if (++stable >= 3) return;
    } else {
      stable = 0;
      last = y;
    }
    await page.waitForTimeout(50);
  }
  throw new Error('scroll never settled');
}

test.describe('hero primary action', () => {
  test('Explore Solutions targets a section that exists', async ({ page }) => {
    await page.goto('/');
    const targets = await page.locator('.hero-primary-action').getAttribute('href');
    expect(targets).toBe('#discovery-stage');
    await expect(page.locator(String(targets))).toHaveCount(1);
  });

  test('clicking it lands on the discovery stage, clear of the sticky header', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hero-primary-action').click();
    await scrollSettled(page);

    /*
     * Measured from the header as rendered, not from --header-height. The header shrinks to
     * 68px once .is-scrolled is applied while the token stays at 80px, so asserting against
     * the token fails a landing that is in fact flush with the header's real bottom edge.
     */
    const headerBottom = await page.evaluate(() =>
      document.querySelector('header')!.getBoundingClientRect().bottom);

    const stage = await page.locator('#discovery-stage').boundingBox();
    expect(stage, 'discovery stage should be laid out').not.toBeNull();

    // Below the header rather than tucked under it, and actually arrived at rather than
    // left somewhere down the page.
    expect(stage!.y).toBeGreaterThanOrEqual(headerBottom - 4);
    expect(stage!.y).toBeLessThan(headerBottom + 120);
  });

  test('keyboard activation moves focus into the discovery stage', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hero-primary-action').focus();
    await page.keyboard.press('Enter');
    await scrollSettled(page);

    /*
     * Without a focusable target, fragment navigation only moves the sequential focus starting
     * point: focus stays on the link, so a screen reader user who activates the call to action
     * is still announced back in the hero while the viewport has moved on.
     */
    const landed = await page.evaluate(() => {
      const stage = document.querySelector('#discovery-stage');
      const active = document.activeElement;
      return !!(stage && active && (stage === active || stage.contains(active)));
    });
    expect(landed, 'focus should be inside #discovery-stage').toBe(true);
  });

  test('that focus does not paint a ring for pointer users', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hero-primary-action').click();
    await scrollSettled(page);
    const outline = await page.evaluate(() => {
      const stage = document.querySelector('#discovery-stage') as HTMLElement;
      const cs = getComputedStyle(stage);
      return { width: cs.outlineWidth, style: cs.outlineStyle };
    });
    expect(outline.style === 'none' || outline.width === '0px').toBe(true);
  });

  test('the landing frame shows the controls, not just a heading', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hero-primary-action').click();
    await scrollSettled(page);

    await expect(page.locator('#discovery-stage .solutions-title')).toBeInViewport();
    await expect(page.locator('#solutionDiscovery .discipline-tab-btn').first()).toBeInViewport();
  });
});
