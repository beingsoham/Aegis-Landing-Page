/**
 * The six stack-tile objects, in ONE canvas behind the grid.
 *
 * Six separate contexts would be wasteful and browsers cap them; instead an
 * orthographic camera is matched 1:1 to CSS pixels, so each object can simply
 * be placed at its tile's centre.
 *
 * Forms are abstract but literal where the maths allows: ML-KEM is a lattice
 * because its hardness IS lattice-based; X25519 is a curve.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type TileHandle = { setHover: (i: number, on: boolean) => void };

export function mount(host: HTMLElement, tiles: HTMLElement[]): (() => void) & TileHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.setAttribute('aria-hidden', 'true');   // decorative; tile text carries meaning
  Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-2, 3, 4);
  const rim = new THREE.DirectionalLight(0xc9d8f0, 0.6); rim.position.set(3, -1, 2);
  scene.add(key, rim);

  /* Cool machined metal at rest; the signal amber only on hover, so the
     objects stay quiet until addressed. */
  const inkM = new THREE.MeshStandardMaterial({ color: 0x8FA2AD, roughness: 0.38, metalness: 0.55, envMapIntensity: 0.9 });
  const accM = new THREE.MeshStandardMaterial({ color: 0xFFB627, roughness: 0.3,  metalness: 0.5,  envMapIntensity: 1.0 });

  /* Authored at whatever scale each form wanted, then normalised: measure the
     bounds and map the largest dimension to one target, or the knot dwarfs
     the lattice. Also tip each into a 3/4 view — face-on, the block and the
     seal read as flat icons. */
  const TARGET = 74;
  const groups = [lattice(), curve(), seal(), combine(), block(), ratchet()].map((g, i) => {
    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    g.children.forEach((c) => c.position.sub(centre));        // centre on its own bounds
    const k = TARGET / Math.max(size.x, size.y, size.z, 0.001);
    g.userData.norm = k;
    g.rotation.set(-0.42, 0.62, 0);                            // 3/4 view
    g.userData.spin = 0.12 + i * 0.01;
    g.userData.hover = 0;
    scene.add(g);
    return g;
  });
  function applyMaterial(m: THREE.Material) {
    groups.forEach((g) => g.traverse((o) => { const mesh = o as THREE.Mesh; if (mesh.isMesh) mesh.material = m; }));
  }
  applyMaterial(inkM);

  /* ---- forms ----------------------------------------------------------- */
  function lattice() {                    // ML-KEM-768 — Module-LWE is lattice-based
    const g = new THREE.Group();
    const s = new THREE.SphereGeometry(3.4, 12, 10);
    const edges: THREE.Vector3[] = [];
    const N = 3, gap = 22;
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
      const p = new THREE.Vector3((x - 1) * gap, (y - 1) * gap, (z - 1) * gap);
      const m = new THREE.Mesh(s); m.position.copy(p); g.add(m);
      if (x < N - 1) edges.push(p, p.clone().setX(p.x + gap));
      if (y < N - 1) edges.push(p, p.clone().setY(p.y + gap));
    }
    const lg = new THREE.BufferGeometry().setFromPoints(edges);
    g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x8FA2AD, transparent: true, opacity: 0.4 })));
    return g;
  }
  function curve() {                      // X25519 — an elliptic curve
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TorusKnotGeometry(24, 5.2, 160, 16, 2, 3)));
    return g;
  }
  function seal() {                       // ML-DSA-65 — a signature seal
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(28, 28, 11, 48));
    body.rotation.x = Math.PI / 2; g.add(body);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(22, 4, 14, 48));
    rim.position.z = 6; g.add(rim);
    for (let i = 0; i < 6; i++) {                 // the impressed mark
      const a = (i / 6) * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.BoxGeometry(4, 13, 5));
      m.position.set(Math.cos(a) * 11, Math.sin(a) * 11, 7);
      m.rotation.z = a; g.add(m);
    }
    return g;
  }
  function combine() {                    // HKDF — two secrets in, one key out
    const g = new THREE.Group();
    const JOIN = new THREE.Vector3(0, -2, 0);
    for (const dir of [-1, 1]) {          // the two inbound strands
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 28; i++) {
        const t = i / 28;
        const spread = (1 - t) * 20;
        pts.push(new THREE.Vector3(
          dir * spread,
          34 - t * 36,
          Math.sin(t * Math.PI) * 7 * dir,
        ));
      }
      pts.push(JOIN.clone());
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 3.2, 10)));
    }
    const out = new THREE.Mesh(new THREE.TubeGeometry(      // the single derived key
      new THREE.CatmullRomCurve3([JOIN.clone(), new THREE.Vector3(0, -20, 0), new THREE.Vector3(0, -36, 0)]),
      20, 5.4, 12));
    g.add(out);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(7.5, 2.2, 10, 28));
    collar.position.copy(JOIN); collar.rotation.x = Math.PI / 2; g.add(collar);
    return g;
  }
  function block() {                      // AES-256-GCM — the cipher block
    const g = new THREE.Group();
    for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(19, 19, 19));
      m.position.set((x - 0.5) * 22, (y - 0.5) * 22, (z - 0.5) * 22);
      g.add(m);
    }
    return g;
  }
  function ratchet() {                    // Double Ratchet — advances, never returns
    const g = new THREE.Group();
    const shape = new THREE.Shape();
    const teeth = 12, R = 30, r = 22;
    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * Math.PI * 2, a1 = ((i + 0.5) / teeth) * Math.PI * 2, a2 = ((i + 1) / teeth) * Math.PI * 2;
      if (i === 0) shape.moveTo(Math.cos(a0) * R, Math.sin(a0) * R);
      else shape.lineTo(Math.cos(a0) * R, Math.sin(a0) * R);
      shape.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
      shape.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
    }
    shape.closePath();
    shape.holes.push(new THREE.Path().absarc(0, 0, 9, 0, Math.PI * 2, true));
    g.add(new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 9, bevelEnabled: true, bevelSize: 1.4, bevelThickness: 1.4, bevelSegments: 2 })));
    return g;
  }

  /* ---- layout: orthographic frustum matched to CSS pixels --------------- */
  const layout = () => {
    const rect = host.getBoundingClientRect();
    const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
    camera.left = -w / 2; camera.right = w / 2;
    camera.top = h / 2; camera.bottom = -h / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    tiles.forEach((tile, i) => {
      const t = tile.getBoundingClientRect();
      const cx = t.left + t.width / 2 - rect.left - w / 2;
      const cy = -(t.top + t.height * 0.26 - rect.top - h / 2);
      const g = groups[i];
      if (!g) return;
      g.position.set(cx, cy, 0);
      /* 46% of the tile: the label and badge need the lower third */
      const fit = (Math.min(t.width, t.height) * 0.36) / TARGET;
      g.scale.setScalar(fit * g.userData.norm);
    });
  };
  layout();
  const ro = new ResizeObserver(layout); ro.observe(host);
  window.addEventListener('scroll', layout, { passive: true });

  let raf = 0, visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(host);

  const clock = new THREE.Clock();
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.1);
    groups.forEach((g) => {
      const boost = g.userData.hover ? 3.2 : 1;
      g.rotation.y += dt * g.userData.spin * boost;
      g.rotation.x += dt * g.userData.spin * 0.35 * boost;
    });
    renderer.render(scene, camera);
  }
  frame();

  const dispose = (() => {
    cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect();
    window.removeEventListener('scroll', layout);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
    });
    inkM.dispose(); accM.dispose();
    pmrem.dispose();
    renderer.dispose();
    host.removeChild(renderer.domElement);
  }) as (() => void) & TileHandle;

  dispose.setHover = (i: number, on: boolean) => {
    const g = groups[i];
    if (!g) return;
    g.userData.hover = on ? 1 : 0;
    g.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) m.material = on ? accM : inkM; });
  };
  return dispose;
}
