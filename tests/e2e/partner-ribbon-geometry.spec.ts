import { test, expect, type Page } from '@playwright/test';

/**
 * The marquee's loop geometry, held as an invariant rather than as a screenshot.
 *
 * The reported fault was a brand visible at both ends of the rail at once. The cause was
 * arithmetic: eight fixed 156px slots plus their gaps came to 1472px while the rail at 1920 is
 * about 1704px, so a second copy of the sequence entered before the first had left. Two copies
 * of a mark are exactly one cycle apart, so the fix is the invariant this file asserts — the
 * cycle stays wider than the rail — and the duplicate becomes impossible rather than unlikely.
 *
 * Widths come from directive 44's table. The identity counts are asserted as ranges because
 * they are a design target, not an accident of the current slot value.
 */


type Geometry = {
  rail: number;
  cycle: number;
  slot: number;
  gap: number;
  identities: number;
  band: number;
};

async function geometry(page: Page): Promise<Geometry> {
  return page.evaluate(() => {
    const section = document.querySelector('.partner-trust-ribbon') as HTMLElement;
    const wrapper = document.querySelector('.ribbon-track-wrapper') as HTMLElement;
    const track = document.querySelector('.primary-track') as HTMLElement;
    const item = document.querySelector('.partner-item') as HTMLElement;
    const gap = parseFloat(getComputedStyle(section).getPropertyValue('--ribbon-gap')) || 28;
    const slot = item.getBoundingClientRect().width;
    return {
      rail: wrapper.clientWidth,
      cycle: track.getBoundingClientRect().width,
      slot,
      gap,
      identities: wrapper.clientWidth / (slot + gap),
      band: section.getBoundingClientRect().height,
    };
  });
}

/** Stops the travel and the landing tilt, so measurements are layout rather than projection. */
async function freeze(page: Page) {
  await page.evaluate(() => {
    const section = document.querySelector('.partner-trust-ribbon') as HTMLElement;
    const inner = document.querySelector('.ribbon-inner') as HTMLElement;
    const strip = document.querySelector('.marquee-strip') as HTMLElement;
    section.style.setProperty('--ribbon-land', '1');
    inner.style.transform = 'none';
    strip.style.animation = 'none';
  });
}

test.describe('partner ribbon loop geometry', () => {
  const widths = [2560, 1920, 1600, 1440, 1366, 1280, 1024];

  for (const width of widths) {
    test(`one cycle stays wider than the rail at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await freeze(page);

      const g = await geometry(page);
      expect(g.cycle, `cycle ${g.cycle} vs rail ${g.rail} at ${width}`).toBeGreaterThan(g.rail);
    });
  }

  test('no brand can appear at both ends of the rail, at any offset', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 900 });
    await page.goto('/');
    await freeze(page);

    const { cycle } = await geometry(page);

    // Sample right through one full cycle: if a duplicate is reachable, some offset shows it.
    for (const fraction of [0, 0.17, 0.33, 0.5, 0.67, 0.83]) {
      const seen = await page.evaluate((offset) => {
        const strip = document.querySelector('.marquee-strip') as HTMLElement;
        strip.style.transform = `translate3d(${-offset}px,0,0)`;
        const rail = document.querySelector('.ribbon-track-wrapper')!.getBoundingClientRect();
        /*
         * Identity is the asset filename, never the alt text. The duplicate sequences are
         * aria-hidden and carry alt="", so keying on alt made a repeat of a mark look like a
         * different brand and the check passed against the very geometry it was written to
         * catch. Verified by restoring the 156px slot: this now fails, and did not before.
         */
        const names: string[] = [];
        document.querySelectorAll('.marquee-strip img').forEach((img) => {
          const box = img.getBoundingClientRect();
          const onScreen = box.right > rail.left && box.left < rail.right && box.width > 0;
          if (onScreen) names.push((img.getAttribute('src') || '').split('/').pop() || '');
        });
        return names.filter(Boolean);
      }, cycle * fraction);

      const duplicated = seen.filter((n, i) => seen.indexOf(n) !== i);
      expect(duplicated, `at offset ${Math.round(fraction * 100)}% of a cycle: ${seen.join(', ')}`).toEqual([]);
    }
  });

  test('the visible rail shows the intended number of identities', async ({ page }) => {
    // directive 44: 1920 → 6.5-7, 1440 → 5.5-6.5, 1366 → 5-6, 1024 → 4-5
    const targets: Array<[number, number, number]> = [
      [1920, 6.4, 7.1],
      [1440, 5.5, 6.5],
      [1366, 5.0, 6.0],
      [1024, 3.9, 5.0],
    ];
    for (const [width, low, high] of targets) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await freeze(page);
      const g = await geometry(page);
      expect(g.identities, `identities at ${width}px`).toBeGreaterThanOrEqual(low);
      expect(g.identities, `identities at ${width}px`).toBeLessThanOrEqual(high);
    }
  });

  test('the seam spacing is the logo spacing, exactly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 900 });
    await page.goto('/');
    await freeze(page);

    const spacing = await page.evaluate(() => {
      const strip = document.querySelector('.marquee-strip') as HTMLElement;
      strip.style.transform = 'none';
      const groups = [...strip.children];
      const boxes = (g: Element) =>
        [...g.querySelectorAll('.partner-item')].map((e) => e.getBoundingClientRect());
      const first = boxes(groups[0]);
      const second = boxes(groups[1]);
      const intra: number[] = [];
      for (let i = 1; i < first.length; i++) intra.push(+(first[i].left - first[i - 1].right).toFixed(2));
      return { intra: [...new Set(intra)], seam: +(second[0].left - first[first.length - 1].right).toFixed(2) };
    });

    // A reset frame that differs from the ordinary rhythm is a visible stutter once per loop.
    expect(spacing.intra.length, `gaps were not uniform: ${spacing.intra.join(', ')}`).toBe(1);
    expect(spacing.seam).toBeCloseTo(spacing.intra[0], 1);
  });

  test('the band stays in its height budget on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 900 });
    await page.goto('/');
    const g = await geometry(page);
    // Less empty band, larger marks: the trade the first-viewport pass was asked for.
    expect(g.band).toBeGreaterThanOrEqual(78);
    expect(g.band).toBeLessThanOrEqual(92);
  });
});
