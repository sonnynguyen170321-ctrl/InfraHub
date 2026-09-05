/**
 * Homepage scene controller.
 *
 * Tracks where the visitor is in the page's sequence of chapters and runs the handoffs that
 * make one chapter create the next. It owns no scroll listener and no rAF of its own: it is a
 * subscriber of the shared homepage scheduler, so its numbers come from the same frame and the
 * same measurements every other scene is using.
 *
 * Progress model. A scene that computes its own real travel — the two pinned scenes and the
 * hero — publishes it to the scheduler, and this controller reads that value. Only the
 * chapters that simply scroll past get a progress derived here, from their passage through the
 * viewport. Deriving a second, approximate number for a scene that already knows its own was
 * what made cross-scene handoffs fire at the wrong visual moment.
 */

import { homepageScheduler, passageProgress, type HomepageFrame } from './homepage-scheduler';

export interface SceneState {
  id: string;
  element: HTMLElement | null;
  activeProgress: number; // 0.00 to 1.00
  isSettled: boolean;
}

/**
 * The homepage's chapters, in order, each addressed by a stable id or component root class.
 * Every one of these must resolve; tests/e2e/homepage-scenes.spec.ts fails the build if one
 * does not. The hero was previously registered as `.hero-chapter`, a class the hero has never
 * carried, so the first chapter of the page was silently absent from the controller.
 */
export const SCENE_SELECTORS: ReadonlyArray<{ id: string; selector: string }> = [
  { id: 'hero', selector: '#hero' },
  { id: 'ecosystem', selector: '.partner-trust-ribbon' },
  { id: 'discovery', selector: '#discovery-stage' },
  { id: 'judgment', selector: '#how-it-works' },
  { id: 'routeReality', selector: '#route-explorer' },
  { id: 'market', selector: '#featured-offers' },
  { id: 'practice', selector: '#who-we-help' },
  { id: 'conversation', selector: '#contact' },
];

export class HomepageSceneSystem {
  private scenes: Map<string, SceneState> = new Map();
  private isDebug: boolean = false;
  private debugHud: HTMLElement | null = null;
  private activeDiscipline: string = 'infrastructure';
  private reducedMotion: boolean = false;

  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebug = urlParams.get('sceneDebug') === '1';

    this.registerScenes();
    this.initListeners();
    if (this.isDebug) {
      this.initDebugHud();
    }
  }

  private registerScenes() {
    for (const config of SCENE_SELECTORS) {
      this.scenes.set(config.id, {
        id: config.id,
        element: document.querySelector<HTMLElement>(config.selector),
        activeProgress: 0,
        isSettled: false,
      });
    }
  }

  /** Scenes the controller could not find. Surfaced by the scene resolution test. */
  public missingScenes(): string[] {
    return [...this.scenes.values()].filter((scene) => !scene.element).map((scene) => scene.id);
  }

  public sceneProgress(id: string): number {
    return this.scenes.get(id)?.activeProgress ?? 0;
  }

  private initListeners() {
    homepageScheduler().onFrame((frame) => this.update(frame));

    // EcosystemSolutions announces which discipline the visitor is on so the discovery handoff
    // can wait for the last one before starting to converge.
    window.addEventListener('infrahub:discipline-changed', ((e: CustomEvent<{ id: string }>) => {
      if (e.detail?.id) {
        this.activeDiscipline = e.detail.id;
        this.updateDebugHud();
      }
    }) as EventListener);
  }

  public update(frame: HomepageFrame) {
    this.reducedMotion = frame.reducedMotion;
    if (frame.reducedMotion || !frame.visible) {
      return;
    }

    const scheduler = homepageScheduler();

    for (const [id, scene] of this.scenes.entries()) {
      if (!scene.element) continue;

      // A scene that knows its own travel is the authority on it.
      const owned = scheduler.progressFor(id);
      scene.activeProgress =
        owned !== null
          ? Number(owned.toFixed(3))
          : Number(passageProgress(scene.element, frame.viewportHeight).toFixed(3));

      const rect = scene.element.getBoundingClientRect();
      scene.isSettled = rect.top <= frame.viewportHeight * 0.3 && rect.bottom >= frame.viewportHeight * 0.7;

      scene.element.style.setProperty('--scene-progress', scene.activeProgress.toString());

      if (id === 'discovery') {
        this.handleDiscoveryHandoff(scene);
      } else if (id === 'judgment') {
        this.handleJudgmentHandoff(scene);
      } else if (id === 'routeReality') {
        this.handleRouteRealityHandoff(scene);
      }
    }

    if (this.isDebug) {
      this.updateDebugHud();
    }
  }

  /**
   * Discovery → Judgment. Once the visitor is on the last discipline and discovery is running
   * out of travel, the discipline rail quietens and the route begins converging into the
   * process spine, so the next chapter is created by this one rather than following it.
   */
  private handleDiscoveryHandoff(scene: SceneState) {
    if (!scene.element) return;
    const judgment = this.scenes.get('judgment');
    if (!judgment?.element) return;

    if (this.activeDiscipline === 'managed' && scene.activeProgress > 0.75) {
      const morphProgress = Math.min(Math.max((scene.activeProgress - 0.75) / 0.25, 0), 1);
      scene.element.style.setProperty('--morph-to-judgment', morphProgress.toFixed(2));
      document.documentElement.style.setProperty('--route-convergence', morphProgress.toFixed(2));
    } else {
      scene.element.style.setProperty('--morph-to-judgment', '0');
      document.documentElement.style.setProperty('--route-convergence', '0');
    }
  }

  /** Judgment → Route Reality: the single delivery route forks into carrier A and carrier B. */
  private handleJudgmentHandoff(scene: SceneState) {
    if (!scene.element) return;
    const reality = this.scenes.get('routeReality');
    if (!reality?.element) return;

    const forkProgress = scene.activeProgress > 0.8 ? Math.min((scene.activeProgress - 0.8) / 0.2, 1) : 0;
    reality.element.style.setProperty('--carrier-fork-progress', forkProgress.toFixed(2));
  }

  /** Route Reality → Market: the physical model flattens into the commercial ledger rule. */
  private handleRouteRealityHandoff(scene: SceneState) {
    if (!scene.element) return;
    const market = this.scenes.get('market');
    if (!market?.element) return;

    const flattenProgress = scene.activeProgress > 0.85 ? Math.min((scene.activeProgress - 0.85) / 0.15, 1) : 0;
    market.element.style.setProperty('--market-flatten-progress', flattenProgress.toFixed(2));
  }

  private initDebugHud() {
    this.debugHud = document.createElement('aside');
    this.debugHud.id = 'scene-debug-hud';
    this.debugHud.setAttribute('aria-label', 'Scene Debugger HUD');
    this.debugHud.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 99999;
      background: rgba(9, 17, 24, 0.94);
      color: #F4F5F1;
      border: 1px solid #2854C7;
      border-radius: 4px;
      padding: 12px 16px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      line-height: 1.4;
      pointer-events: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      max-width: 280px;
    `;
    document.body.appendChild(this.debugHud);
    this.updateDebugHud();
  }

  private updateDebugHud() {
    if (!this.debugHud) return;

    let activeSceneId = 'none';
    let activeProgress = 0;

    for (const [id, scene] of this.scenes.entries()) {
      if (scene.element) {
        const rect = scene.element.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
          activeSceneId = id;
          activeProgress = scene.activeProgress;
          break;
        }
      }
    }

    const missing = this.missingScenes();

    this.debugHud.innerHTML = `
      <div style="font-weight:700;color:#93C5FD;margin-bottom:4px;border-bottom:1px solid #1E44A8;padding-bottom:2px;">
        INFRAHUB SCENE HUD
      </div>
      <div>Active Scene: <span style="color:#F4F5F1;font-weight:600;">${activeSceneId}</span></div>
      <div>Progress: <span style="color:#38BDF8;">${(activeProgress * 100).toFixed(1)}%</span></div>
      <div>Discipline: <span style="color:#34D399;">${this.activeDiscipline}</span></div>
      <div>Reduced Motion: <span style="color:${this.reducedMotion ? '#F87171' : '#A7F3D0'}">${this.reducedMotion ? 'ACTIVE' : 'OFF'}</span></div>
      <div>Missing scenes: <span style="color:${missing.length ? '#F87171' : '#A7F3D0'}">${missing.length ? missing.join(', ') : 'none'}</span></div>
      <div>Viewport: <span style="color:#CBD5E1;">${window.innerWidth}×${window.innerHeight}</span></div>
    `;
  }
}

// Auto-initialize when loaded on client, and expose the instance so tests can assert that
// every chapter of the page actually resolved.
if (typeof window !== 'undefined') {
  const start = () => {
    (window as unknown as { __infrahubScenes?: HomepageSceneSystem }).__infrahubScenes =
      new HomepageSceneSystem();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}
