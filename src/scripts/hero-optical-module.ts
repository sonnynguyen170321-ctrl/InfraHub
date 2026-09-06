// src/scripts/hero-optical-module.ts
//
// The hero's one physical object: a vendor-neutral optical transceiver with a fibre lead that
// runs back into the facility. It is the only part of the page rendered with real 3D, because
// it is the only part where material, lighting and depth carry meaning. The photograph, the
// copy and the existing spatial handoff are untouched.
//
// Deliberately generic. No vendor mark, no model number, no brand colour, no port label: the
// visitor should read "infrastructure hardware", never a product for sale. Geometry is built
// procedurally rather than loaded, so there is no third-party asset, no licence question and
// no megabyte of GLTF.
//
// Material language is brushed graphite and dark anodised metal under a soft key light with a
// weak rim. No chrome, no gold, no neon, no bloom. Metal without an environment to reflect
// reads as flat grey plastic, which is the single thing that makes procedural 3D look cheap --
// so a small gradient environment is generated in a canvas at runtime. That is a few hundred
// bytes of code rather than an HDR download.

import {
  ACESFilmicToneMapping,
  AmbientLight,
  CanvasTexture,
  CatmullRomCurve3,
  CylinderGeometry,
  DirectionalLight,
  EquirectangularReflectionMapping,
  ExtrudeGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  PMREMGenerator,
  Scene,
  Shape,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

export type OpticalModule = {
  /** Drives the entrance. 0 before the reveal, 1 once settled. */
  setReveal(value: number): void;
  /** Hero exit progress, 0 to 1: the module recedes as the partner surface arrives. */
  setExit(value: number): void;
  /** Pointer position in normalised device coordinates, or null to return to rest. */
  setPointer(x: number | null, y: number | null): void;
  resize(): void;
  dispose(): void;
};

const GRAPHITE = 0x40464f;
const ANODISED = 0x363c45;
const APERTURE = 0x0a0d11;

/** A rounded rectangle profile, extruded and bevelled: a chassis, not a box. */
function chassisGeometry(width: number, height: number, depth: number, radius: number) {
  const shape = new Shape();
  const w = width / 2;
  const h = height / 2;
  shape.moveTo(-w + radius, -h);
  shape.lineTo(w - radius, -h);
  shape.quadraticCurveTo(w, -h, w, -h + radius);
  shape.lineTo(w, h - radius);
  shape.quadraticCurveTo(w, h, w - radius, h);
  shape.lineTo(-w + radius, h);
  shape.quadraticCurveTo(-w, h, -w, h - radius);
  shape.lineTo(-w, -h + radius);
  shape.quadraticCurveTo(-w, -h, -w + radius, -h);

  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 8,
  });
  geometry.center();
  return geometry;
}

/**
 * A soft studio gradient, generated rather than downloaded. Two broad highlights over a dark
 * floor give the metal something to reflect; without it MeshStandardMaterial at high metalness
 * resolves to near-black and the object reads as a toy.
 */
function studioEnvironment(renderer: WebGLRenderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  const sky = ctx.createLinearGradient(0, 0, 0, 32);
  sky.addColorStop(0, '#ffffff');
  sky.addColorStop(0.42, '#c2ccd8');
  sky.addColorStop(0.68, '#6b7481');
  sky.addColorStop(1, '#20252b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 64, 32);

  const keyLight = ctx.createRadialGradient(16, 7, 0, 16, 7, 16);
  keyLight.addColorStop(0, 'rgba(255,255,255,0.95)');
  keyLight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = keyLight;
  ctx.fillRect(0, 0, 64, 32);

  const fillLight = ctx.createRadialGradient(48, 12, 0, 48, 12, 12);
  fillLight.addColorStop(0, 'rgba(150,180,215,0.5)');
  fillLight.addColorStop(1, 'rgba(150,180,215,0)');
  ctx.fillStyle = fillLight;
  ctx.fillRect(0, 0, 64, 32);

  const texture = new CanvasTexture(canvas);
  texture.mapping = EquirectangularReflectionMapping;
  texture.colorSpace = SRGBColorSpace;

  const pmrem = new PMREMGenerator(renderer);
  const target = pmrem.fromEquirectangular(texture);
  texture.dispose();
  pmrem.dispose();
  return target.texture;
}

/**
 * A brushed-metal roughness map, drawn rather than downloaded. Fine streaks along one axis are
 * what separates machined aluminium from moulded plastic: without them every face returns one
 * flat specular value and the object reads as a toy regardless of how well it is lit. This is
 * procedural geometry's missing half — the constraint was no HDR and no downloaded texture, and
 * a canvas of noise is neither.
 */
function brushedRoughness() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#8a8a8a';
  ctx.fillRect(0, 0, 512, 32);
  for (let i = 0; i < 1400; i++) {
    const y = Math.random() * 32;
    const x = Math.random() * 512;
    const length = 12 + Math.random() * 90;
    const value = 108 + Math.random() * 92;
    ctx.strokeStyle = `rgb(${value},${value},${value})`;
    ctx.lineWidth = Math.random() < 0.75 ? 0.5 : 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 1);
  return texture;
}

export function createOpticalModule(canvas: HTMLCanvasElement): OpticalModule {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  // Capped: this is an accent, not the subject of the page.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;

  const scene = new Scene();
  const environment = studioEnvironment(renderer);
  scene.environment = environment;

  const camera = new PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 0.2, 4.35);

  const brushed = brushedRoughness();
  const body = new MeshPhysicalMaterial({
    color: GRAPHITE,
    metalness: 0.88,
    roughness: 0.34,
    roughnessMap: brushed,
    anisotropy: 0.85,
    anisotropyRotation: Math.PI / 2,
  });
  const dark = new MeshStandardMaterial({ color: ANODISED, metalness: 0.65, roughness: 0.45 });
  const aperture = new MeshStandardMaterial({ color: APERTURE, metalness: 0.35, roughness: 0.62 });
  const boreRing = new MeshPhysicalMaterial({ color: 0x8e97a3, metalness: 0.95, roughness: 0.22 });
  const sheath = new MeshStandardMaterial({ color: 0x161a1f, metalness: 0.25, roughness: 0.7 });
  const materials = [body, dark, aperture, sheath, boreRing];


  const module = new Group();

  const chassis = new Mesh(chassisGeometry(2.35, 0.42, 0.56, 0.055), body);
  module.add(chassis);

  // Front face: a recessed aperture, with the latch above it.
  const face = new Mesh(chassisGeometry(0.5, 0.34, 0.05, 0.025), aperture);
  face.position.set(-1.185, -0.01, 0.0);
  face.rotation.y = Math.PI / 2;
  module.add(face);

  // The duplex bores. This is the detail that makes the object legible as an optical port.
  const boreGeometry = new CylinderGeometry(0.055, 0.055, 0.1, 18);
  const bores: Mesh[] = [];
  const ringGeometry = new CylinderGeometry(0.068, 0.068, 0.03, 20);
  for (const offset of [-0.12, 0.12]) {
    const bore = new Mesh(boreGeometry, aperture);
    bore.rotation.z = Math.PI / 2;
    bore.position.set(-1.21, -0.01, offset);
    bores.push(bore);
    module.add(bore);

    const ring = new Mesh(ringGeometry, boreRing);
    ring.rotation.z = Math.PI / 2;
    ring.position.set(-1.238, -0.01, offset);
    bores.push(ring);
    module.add(ring);
  }

  const latch = new Mesh(chassisGeometry(0.5, 0.07, 0.1, 0.02), dark);
  latch.position.set(-0.86, 0.16, 0);
  module.add(latch);

  // Venting: shallow slots along the flank, enough to read as hardware and no more.
  const vents: Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const vent = new Mesh(chassisGeometry(0.2, 0.035, 0.02, 0.01), dark);
    vent.position.set(0.16 + i * 0.24, -0.1, 0.285);
    vents.push(vent);
    module.add(vent);
  }

  // Two ferrules, and the fibre pair leaving them back and right into the facility.
  const ferruleGeometry = new CylinderGeometry(0.052, 0.052, 0.26, 20);
  for (const offset of [-0.11, 0.11]) {
    const ferrule = new Mesh(ferruleGeometry, dark);
    ferrule.rotation.z = Math.PI / 2;
    ferrule.position.set(1.31, offset, 0);
    module.add(ferrule);
  }

  const leads: Mesh[] = [];
  for (const offset of [-0.11, 0.11]) {
    const curve = new CatmullRomCurve3([
      new Vector3(1.41, offset, 0),
      new Vector3(2.1, offset * 1.5 - 0.06, 0.26),
      new Vector3(3.15, -0.42 + offset * 0.6, 0.9),
      new Vector3(4.6, -1.05, 1.9),
    ]);
    const lead = new Mesh(new TubeGeometry(curve, 42, 0.032, 10, false), sheath);
    leads.push(lead);
    module.add(lead);
  }

  const key = new DirectionalLight(0xffffff, 3.1);
  key.position.set(-2.6, 2.4, 3.2);
  const rim = new DirectionalLight(0xcfe0f5, 1.9); // cold, and strong enough to cut the object off a dark frame
  rim.position.set(2.8, 0.6, -2.4);
  scene.add(module, key, rim, new AmbientLight(0xffffff, 0.16));

  const REST_ROTATION_X = MathUtils.degToRad(-11);
  const REST_ROTATION_Y = MathUtils.degToRad(58);

  let reveal = 0;
  let exit = 0;
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let disposed = false;

  function apply() {
    frame = 0;
    if (disposed) return;

    // Entrance: deeper in z, right and low, resolving forward and left. No spin, no float.
    const eased = 1 - Math.pow(1 - reveal, 3);
    const departing = exit;

    module.position.set(
      0.42 * (1 - eased) + departing * 1.5,
      -0.16 * (1 - eased) - departing * 0.55,
      -1.35 * (1 - eased) - departing * 2.2,
    );
    module.rotation.set(
      REST_ROTATION_X + pointerY * MathUtils.degToRad(2),
      REST_ROTATION_Y + MathUtils.degToRad(7) * (1 - eased) + pointerX * MathUtils.degToRad(2),
      0,
    );
    // Pointer translation, deliberately tiny: a response, not a motion.
    module.position.x += pointerX * 0.05;
    module.position.y += pointerY * 0.03;

    const fade = eased * (1 - departing * 0.85);
    for (const material of materials) {
      material.transparent = fade < 0.999;
      material.opacity = fade;
    }

    renderer.render(scene, camera);
  }

  /** Renders on demand only. There is no permanent animation loop. */
  function request() {
    if (frame || disposed) return;
    frame = requestAnimationFrame(apply);
  }

  function resize() {
    if (disposed) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    request();
  }

  resize();

  return {
    setReveal(value) {
      reveal = Math.min(Math.max(value, 0), 1);
      request();
    },
    setExit(value) {
      exit = Math.min(Math.max(value, 0), 1);
      request();
    },
    setPointer(x, y) {
      pointerX = x === null ? 0 : Math.min(Math.max(x, -1), 1);
      pointerY = y === null ? 0 : Math.min(Math.max(y, -1), 1);
      request();
    },
    resize,
    dispose() {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      leads.forEach((lead) => lead.geometry.dispose());
      boreGeometry.dispose();
      ringGeometry.dispose();
      vents.forEach((vent) => vent.geometry.dispose());
      chassis.geometry.dispose();
      face.geometry.dispose();
      latch.geometry.dispose();
      ferruleGeometry.dispose();
      materials.forEach((material) => material.dispose());
      brushed.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
