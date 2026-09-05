/**
 * InfraHub Hero → Partner Ecosystem 2.5D Spatial Perspective Transition
 * "THE ROUTE LEAVES THE FACILITY"
 *
 * Lightweight, zero-dependency 2.5D spatial projection engine using
 * CanvasRenderingContext2D with mathematical 3D perspective projection,
 * spline interpolation, architectural plane rotation, on-demand scroll rendering,
 * and seamless crossfade handoff into the DOM PartnerTrustRibbon.
 *
 * Restrained spatial canvas treatment (~6 KB, 0 external dependencies).
 */

export interface Hero3DConfig {
  containerId: string;
  canvasId: string;
  heroId: string;
  partnerId: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export class Hero3DTransitionController {
  private container: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private heroEl: HTMLElement | null = null;
  private partnerEl: HTMLElement | null = null;

  private isInitialized: boolean = false;
  private isDestroyed: boolean = false;
  private isRendering: boolean = false;
  private currentProgress: number = 0;
  private targetProgress: number = 0;
  private rafId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  // 3D spline definition (Directives 03, 04, 05)
  private splinePoints: Vec3[] = [
    { x: 1.1, y: 1.45, z: -2.6 },   // Origin in overhead cable tray
    { x: 0.72, y: 0.95, z: -1.6 },  // Descending into aisle space
    { x: 0.32, y: 0.32, z: -0.7 },  // Arriving forward toward camera
    { x: 0.06, y: -0.42, z: 0.1 },  // Landing onto the partner plane
    { x: -0.45, y: -1.02, z: 0.3 }, // Turning into structural baseline
    { x: -1.9, y: -1.02, z: 0.3 }   // Extending along partner axis
  ];

  public get ready(): boolean {
    return this.isInitialized && !this.isDestroyed;
  }

  constructor(private config: Hero3DConfig) {}

  public async init(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Gate: reduced motion preference (Directive 34)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }

    // Gate: desktop only for 3D canvas (Directive 32)
    if (window.innerWidth < 1024) {
      return false;
    }

    this.container = document.getElementById(this.config.containerId);
    this.canvas = document.getElementById(this.config.canvasId) as HTMLCanvasElement | null;
    this.heroEl = document.getElementById(this.config.heroId);
    this.partnerEl = document.querySelector(this.config.partnerId);

    if (!this.container || !this.canvas || !this.heroEl || !this.partnerEl) {
      return false;
    }

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    if (!this.ctx) return false;

    this.setupObservers();
    this.onResize();
    this.onScroll();

    this.isInitialized = true;
    this.canvas.style.transition = 'opacity 280ms ease-out';
    this.canvas.style.opacity = '1';
    return true;
  }

  private setupObservers() {
    this.resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });

    if (this.container) this.resizeObserver.observe(this.container);
    if (this.heroEl) this.resizeObserver.observe(this.heroEl);

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  private handleScroll = () => {
    this.onScroll();
  };

  private handleResize = () => {
    this.onResize();
  };

  public updateProgress(progress: number) {
    this.targetProgress = Math.min(Math.max(progress, 0), 1);
    if (!this.isRendering) {
      this.requestRender();
    }
  }

  private onScroll() {
    if (!this.heroEl) return;
    const heroHeight = this.heroEl.offsetHeight || 1;
    const scrollY = window.scrollY;

    // Transition occupies hero scroll progress ~0.55 to ~1.02
    const progress = Math.min(Math.max((scrollY - heroHeight * 0.45) / (heroHeight * 0.55), 0), 1);
    this.updateProgress(progress);
  }

  private onResize() {
    if (!this.canvas || !this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || (window.innerHeight * 0.75);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.requestRender();
  }

  private requestRender() {
    if (this.isDestroyed || !this.ctx || !this.canvas) return;
    this.isRendering = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.rafId = requestAnimationFrame(() => {
      this.render();
    });
  }

  /**
   * True 3D perspective projection onto canvas coordinates.
   * Camera: FOV 28°, position [0, camY, camZ], looking at [0, targetY, 0].
   */
  private project3D(point: Vec3, width: number, height: number, progress: number): { x: number; y: number; scale: number; visible: boolean } {
    // Camera moves forward and levels out as scroll progresses (Directive 15 & 20)
    const camY = (1 - progress) * 0.25;
    const camZ = 7.2 - progress * 0.5;
    const targetY = -0.35 * (1 - progress);

    const fov = 28 * (Math.PI / 180);
    const focalLength = (height / 2) / Math.tan(fov / 2);

    const relX = point.x;
    const relY = point.y - camY;
    const relZ = camZ - point.z;

    if (relZ <= 0.1) {
      return { x: 0, y: 0, scale: 0, visible: false };
    }

    const screenX = (width / 2) + (relX * focalLength) / relZ;
    const screenY = (height / 2) - ((relY - targetY) * focalLength) / relZ;
    const scale = focalLength / relZ;

    return { x: screenX, y: screenY, scale, visible: true };
  }

  /**
   * Catmull-Rom spline interpolation through 3D points.
   */
  private interpolateSpline(points: Vec3[], t: number): Vec3 {
    const p = Math.max(0, Math.min(t, 0.9999)) * (points.length - 1);
    const i = Math.floor(p);
    const u = p - i;

    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const u2 = u * u;
    const u3 = u2 * u;

    return {
      x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * u + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
      y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * u + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3),
      z: 0.5 * ((2 * p1.z) + (-p0.z + p2.z) * u + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * u2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * u3)
    };
  }

  private render() {
    if (this.isDestroyed || !this.ctx || !this.canvas) {
      this.isRendering = false;
      return;
    }

    const delta = this.targetProgress - this.currentProgress;
    if (Math.abs(delta) > 0.001) {
      this.currentProgress += delta * 0.28;
      this.requestRender();
    } else {
      this.currentProgress = this.targetProgress;
      this.isRendering = false;
    }

    const p = this.currentProgress;
    const ctx = this.ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = this.canvas.width / dpr;
    const height = this.canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Fade out canvas completely during final handoff into DOM PartnerTrustRibbon (Directives 18 & 19)
    const masterOpacity = p > 0.94 ? Math.max(0, (1 - p) / 0.06) : 1;
    ctx.globalAlpha = masterOpacity;

    // 1. Render Architectural Partner Plane (Directives 06, 17, 21)
    if (p > 0.25) {
      const planeProgress = Math.min(Math.max((p - 0.25) / 0.7, 0), 1);
      const easedTilt = 1 - Math.pow(1 - planeProgress, 2.2);
      const tiltAngle = (1 - easedTilt) * 0.14; // Perspective tilt (radians)

      const planeWidth = 6.0;
      const planeDepth = 2.4;
      const planeY = -1.15 + (1 - easedTilt) * -0.3;

      // 4 corners of the architectural plane in 3D
      const corners: Vec3[] = [
        { x: -planeWidth, y: planeY + Math.sin(tiltAngle) * planeDepth, z: -planeDepth },
        { x: planeWidth, y: planeY + Math.sin(tiltAngle) * planeDepth, z: -planeDepth },
        { x: planeWidth, y: planeY, z: planeDepth },
        { x: -planeWidth, y: planeY, z: planeDepth }
      ];

      const projectedCorners = corners.map(c => this.project3D(c, width, height, p));

      if (projectedCorners.every(c => c.visible)) {
        // Reaches 1, not 0.92: the plane's bottom edge butts directly against the partner
        // ribbon, so anything less composites the dark photograph through it and leaves a
        // visible step at the seam.
        const planeAlpha = Math.min((p - 0.25) / 0.25, 1);
        ctx.beginPath();
        ctx.moveTo(projectedCorners[0].x, projectedCorners[0].y);
        ctx.lineTo(projectedCorners[1].x, projectedCorners[1].y);
        ctx.lineTo(projectedCorners[2].x, projectedCorners[2].y);
        ctx.lineTo(projectedCorners[3].x, projectedCorners[3].y);
        ctx.closePath();

        const grad = ctx.createLinearGradient(
          0, projectedCorners[0].y,
          0, projectedCorners[2].y
        );
        // Warm paper, the same #F7F7F5 the ribbon and .section-solutions carry, rather than a
        // cool white that reads as a different material where the two surfaces meet.
        grad.addColorStop(0, `rgba(247, 247, 245, ${0.4 * planeAlpha})`);
        grad.addColorStop(0.5, `rgba(247, 247, 245, ${0.85 * planeAlpha})`);
        grad.addColorStop(1, `rgba(247, 247, 245, ${planeAlpha})`);

        ctx.fillStyle = grad;
        ctx.fill();

        // Subtle leading edge highlight
        ctx.strokeStyle = `rgba(37, 99, 235, ${0.25 * planeAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // 2. Render 3D Route Spline (Directives 03, 04, 05, 22)
    const splineSamples = 80;
    const maxT = Math.min(p * 1.35, 1);
    const steps = Math.floor(maxT * splineSamples);

    if (steps >= 2) {
      const screenPoints: { x: number; y: number; alpha: number }[] = [];

      for (let i = 0; i <= steps; i++) {
        const t = i / splineSamples;
        const pt3D = this.interpolateSpline(this.splinePoints, t);
        const proj = this.project3D(pt3D, width, height, p);

        if (proj.visible) {
          screenPoints.push({
            x: proj.x,
            y: proj.y,
            alpha: Math.min(t * 1.5, 1)
          });
        }
      }

      if (screenPoints.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(screenPoints[0].x, screenPoints[0].y);

        for (let i = 1; i < screenPoints.length; i++) {
          ctx.lineTo(screenPoints[i].x, screenPoints[i].y);
        }

        const routeGrad = ctx.createLinearGradient(
          screenPoints[0].x, screenPoints[0].y,
          screenPoints[screenPoints.length - 1].x, screenPoints[screenPoints.length - 1].y
        );
        routeGrad.addColorStop(0, 'rgba(164, 185, 212, 0.45)');
        routeGrad.addColorStop(0.45, 'rgba(80, 130, 230, 0.85)');
        routeGrad.addColorStop(1, '#2563eb');

        ctx.strokeStyle = routeGrad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Landing junction point (Directive 23)
        if (p > 0.65) {
          const landingPt = screenPoints[Math.min(Math.floor(splineSamples * 0.6), screenPoints.length - 1)];
          const jAlpha = Math.min((p - 0.65) / 0.2, 1);
          ctx.beginPath();
          ctx.arc(landingPt.x, landingPt.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(37, 99, 235, ${jAlpha})`;
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.canvas) {
      this.canvas.style.opacity = '0';
    }

    this.ctx = null;
  }
}

// Idle Auto-Initialization (Directives 28, 47)
export function initHero3DTransition() {
  if (typeof window === 'undefined') return;

  const controller = new Hero3DTransitionController({
    containerId: 'heroSpatialTransition',
    canvasId: 'hero3dCanvas',
    heroId: 'hero',
    partnerId: '.partner-trust-ribbon'
  });

  const launch = () => {
    controller.init();
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(launch, { timeout: 2000 });
  } else {
    setTimeout(launch, 1200);
  }
}
