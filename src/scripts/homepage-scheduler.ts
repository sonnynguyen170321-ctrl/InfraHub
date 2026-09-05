/**
 * One scroll event, one rAF, one set of viewport measurements, shared by every homepage scene.
 *
 * The homepage had five independent scroll pipelines — the hero, the scene system, discovery,
 * the route exhibit and the header — each with its own listener, its own rAF gate and its own
 * call to getBoundingClientRect on the same frame. They did overlapping work and, worse, they
 * disagreed: the scene system measured progress as a section's passage through the viewport
 * while the two pinned scenes measured their own sticky travel, so a "75% through discovery"
 * handoff fired at a different visual moment than the one discovery itself was showing.
 *
 * This is a scheduler, not a framework. It owns no animation and no scene state. Components
 * still compute their own local progress; they just do it inside one batched frame, from one
 * reading of the viewport, using one shared definition of what progress means.
 */

export interface HomepageFrame {
  scrollY: number;
  viewportWidth: number;
  viewportHeight: number;
  reducedMotion: boolean;
  /** False while the tab is hidden, so scenes can skip work that nobody can see. */
  visible: boolean;
}

type FrameListener = (frame: HomepageFrame) => void;

/**
 * Normalized travel of a pinned scene: 0 when its sticky child starts holding, 1 when the
 * scene releases it. This is the definition every pinned scene on the page uses; a second,
 * approximate version is what put the scene system in a different coordinate system.
 */
export function pinnedProgress(scene: HTMLElement | null, sticky: HTMLElement | null, scrollY: number): number {
  if (!scene) return 0;
  const travel = scene.offsetHeight - (sticky ? sticky.offsetHeight : 0);
  if (travel <= 0) return 0;
  const sceneTop = scene.getBoundingClientRect().top + window.scrollY;
  return clamp((scrollY - sceneTop) / travel);
}

/**
 * Normalized passage of a section that is not pinned: 0 as its top reaches the bottom of the
 * viewport, 1 as its bottom leaves the top. Used for the chapters that simply scroll past.
 * Takes no scroll position: getBoundingClientRect is already viewport-relative, so passing one
 * in only invites the two to disagree.
 */
export function passageProgress(element: HTMLElement | null, viewportHeight: number): number {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const height = rect.height || 1;
  return clamp((viewportHeight - rect.top) / (viewportHeight + height));
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

class HomepageScheduler {
  private listeners = new Set<FrameListener>();
  private progressSources = new Map<string, () => number>();
  private ticking = false;
  private reducedMotionQuery: MediaQueryList;

  constructor() {
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const request = () => this.request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    document.addEventListener('visibilitychange', request);
    this.reducedMotionQuery.addEventListener('change', request);
  }

  /** Subscribe to batched frames. Returns an unsubscribe function. */
  onFrame(listener: FrameListener): () => void {
    this.listeners.add(listener);
    this.request();
    return () => this.listeners.delete(listener);
  }

  /**
   * A scene that computes its own real progress publishes it here, so the scene system reads
   * the same number the scene is actually rendering rather than deriving a second estimate.
   */
  registerProgressSource(id: string, source: () => number): void {
    this.progressSources.set(id, source);
  }

  progressFor(id: string): number | null {
    const source = this.progressSources.get(id);
    return source ? clamp(source()) : null;
  }

  request(): void {
    if (this.ticking) return;
    this.ticking = true;
    window.requestAnimationFrame(() => {
      this.ticking = false;
      this.flush();
    });
  }

  private flush(): void {
    const frame: HomepageFrame = {
      scrollY: window.scrollY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      reducedMotion: this.reducedMotionQuery.matches,
      visible: document.visibilityState === 'visible',
    };
    for (const listener of this.listeners) listener(frame);
  }
}

let instance: HomepageScheduler | null = null;

/** Lazily created so importing this module on the server does no work. */
export function homepageScheduler(): HomepageScheduler {
  if (!instance) instance = new HomepageScheduler();
  return instance;
}
