/**
 * InfraHub Homepage Scene Controller (Master Art Direction Directive 02 & 03)
 *
 * Coordinates chapter progression, inter-scene transition contracts, continuous route-line
 * states, and developer HUD (?sceneDebug=1) without external libraries or wheel hijacking.
 */

export interface SceneState {
  id: string;
  element: HTMLElement | null;
  activeProgress: number; // 0.00 to 1.00
  isSettled: boolean;
}

export class HomepageSceneSystem {
  private scenes: Map<string, SceneState> = new Map();
  private isReducedMotion: boolean = false;
  private isDebug: boolean = false;
  private debugHud: HTMLElement | null = null;
  private ticking: boolean = false;
  private activeDiscipline: string = 'infrastructure';

  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebug = urlParams.get('sceneDebug') === '1';

    this.registerScenes();
    this.initListeners();
    if (this.isDebug) {
      this.initDebugHud();
    }
    this.update();
  }

  private registerScenes() {
    const sceneConfigs = [
      { id: 'hero', selector: '.hero-chapter' },
      { id: 'ecosystem', selector: '.partner-trust-ribbon' },
      { id: 'discovery', selector: '#discovery-stage' },
      { id: 'judgment', selector: '#how-it-works' },
      { id: 'routeReality', selector: '#route-explorer' },
      { id: 'market', selector: '#featured-offers' },
      { id: 'practice', selector: '#who-we-help' },
      { id: 'conversation', selector: '#contact' },
    ];

    for (const config of sceneConfigs) {
      const el = document.querySelector<HTMLElement>(config.selector);
      this.scenes.set(config.id, {
        id: config.id,
        element: el,
        activeProgress: 0,
        isSettled: false,
      });
    }
  }

  private initListeners() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      this.update();
    }, { passive: true });

    // Listen for custom discipline change events from EcosystemSolutions
    window.addEventListener('infrahub:discipline-changed', ((e: CustomEvent<{ id: string }>) => {
      if (e.detail?.id) {
        this.activeDiscipline = e.detail.id;
        this.updateDebugHud();
      }
    }) as EventListener);
  }

  public update() {
    if (this.isReducedMotion) {
      return;
    }

    const viewportHeight = window.innerHeight;

    for (const [id, scene] of this.scenes.entries()) {
      if (!scene.element) continue;

      const rect = scene.element.getBoundingClientRect();
      const elementHeight = rect.height || 1;
      
      // Calculate progress: 0 when element top hits viewport bottom, 1 when element bottom hits viewport top
      const progress = Math.min(Math.max((viewportHeight - rect.top) / (viewportHeight + elementHeight), 0), 1);
      scene.activeProgress = parseFloat(progress.toFixed(3));
      scene.isSettled = rect.top <= viewportHeight * 0.3 && rect.bottom >= viewportHeight * 0.7;

      // Set CSS variable on the element for scoped progress styling
      scene.element.style.setProperty('--scene-progress', scene.activeProgress.toString());
      
      // Check for transition contracts
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
   * Transition Contract: Discovery → Judgment (Directive 17)
   * When Managed Operations reaches its exit threshold, signal convergence into Judgment
   */
  private handleDiscoveryHandoff(scene: SceneState) {
    if (!scene.element) return;
    const judgment = this.scenes.get('judgment');
    if (!judgment?.element) return;

    // Transition zone: final 15% of discovery
    if (this.activeDiscipline === 'managed' && scene.activeProgress > 0.75) {
      const morphProgress = Math.min(Math.max((scene.activeProgress - 0.75) / 0.25, 0), 1);
      scene.element.style.setProperty('--morph-to-judgment', morphProgress.toFixed(2));
      document.documentElement.style.setProperty('--route-convergence', morphProgress.toFixed(2));
    } else {
      scene.element.style.setProperty('--morph-to-judgment', '0');
      document.documentElement.style.setProperty('--route-convergence', '0');
    }
  }

  /**
   * Transition Contract: Judgment → Route Reality (Directive 20)
   * The single provider delivery route forks into Carrier A & Carrier B
   */
  private handleJudgmentHandoff(scene: SceneState) {
    if (!scene.element) return;
    const reality = this.scenes.get('routeReality');
    if (!reality?.element) return;

    // When judgment is exiting, prepare carrier fork
    if (scene.activeProgress > 0.8) {
      const forkProgress = Math.min(Math.max((scene.activeProgress - 0.8) / 0.2, 0), 1);
      reality.element.style.setProperty('--carrier-fork-progress', forkProgress.toFixed(2));
    }
  }

  /**
   * Transition Contract: Route Reality → Market (Directive 26)
   * 3D physical route flattens into 1px commercial ledger rule
   */
  private handleRouteRealityHandoff(scene: SceneState) {
    if (!scene.element) return;
    const market = this.scenes.get('market');
    if (!market?.element) return;

    if (scene.activeProgress > 0.85) {
      const flattenProgress = Math.min(Math.max((scene.activeProgress - 0.85) / 0.15, 0), 1);
      market.element.style.setProperty('--market-flatten-progress', flattenProgress.toFixed(2));
    }
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
      max-width: 260px;
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

    this.debugHud.innerHTML = `
      <div style="font-weight:700;color:#93C5FD;margin-bottom:4px;border-bottom:1px solid #1E44A8;padding-bottom:2px;">
        INFRAHUB SCENE HUD
      </div>
      <div>Active Scene: <span style="color:#F4F5F1;font-weight:600;">${activeSceneId}</span></div>
      <div>Progress: <span style="color:#38BDF8;">${(activeProgress * 100).toFixed(1)}%</span></div>
      <div>Discipline: <span style="color:#34D399;">${this.activeDiscipline}</span></div>
      <div>Reduced Motion: <span style="color:${this.isReducedMotion ? '#F87171' : '#A7F3D0'}">${this.isReducedMotion ? 'ACTIVE' : 'OFF'}</span></div>
      <div>Viewport: <span style="color:#CBD5E1;">${window.innerWidth}×${window.innerHeight}</span></div>
    `;
  }
}

// Auto-initialize when loaded on client
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HomepageSceneSystem());
  } else {
    new HomepageSceneSystem();
  }
}
