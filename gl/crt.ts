/**
 * The hero CRT. Ported from crt-prototype.html.
 *
 * Vanilla three rather than react-three-fiber: this is one static scene with a
 * single pointer interaction, so the reconciler buys nothing and costs ~50KB.
 *
 * mount() returns a dispose function. Caller is responsible for tier gating —
 * see CrtHero.tsx.
 */
import * as THREE from 'three';
import { EffectComposer }   from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }       from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass }  from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass }       from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass }       from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment }  from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const CIPHER = 'SGVsbG8gV29ybGQh';        // real base64 of "Hello World!"
const PLAIN  = '  Hello World!  ';        // padded to the same 16 columns
const B64    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function mount(host: HTMLElement, reduced = false): () => void {
  /* antialias can ONLY be set at construction — assigning it later is a no-op */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);          // composite over the page ground
  renderer.toneMapping = THREE.NoToneMapping;   // keep >1 values for the bloom threshold
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute(
    'aria-label',
    'A cathode-ray television. Its screen cycles between the ciphertext SGVsbG8gV29ybGQh and the plaintext Hello World.',
  );
  Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  }
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.06, 9.5);

  scene.add(new THREE.AmbientLight(0xe4e8ee, 0.10));
  const key  = new THREE.DirectionalLight(0xffffff, 1.35); key.position.set(-4.5, 5, 7);
  const rim  = new THREE.DirectionalLight(0xc9d8f0, 0.50); rim.position.set(6, -0.5, 3);
  const fill = new THREE.DirectionalLight(0x8899ff, 0.25); fill.position.set(3, 2, -5);
  const fwd  = new THREE.DirectionalLight(0xffffff, 0.30); fwd.position.set(0, 0, 10);
  scene.add(key, rim, fill, fwd);

  const tv = new THREE.Group();
  scene.add(tv);

  /* ---- surfaces -------------------------------------------------------- */
  const plasticTex = plasticTexture();
  const { normalMap, roughnessMap } = deriveMaps(plasticTex.image as HTMLCanvasElement);
  const aniso = renderer.capabilities.getMaxAnisotropy();
  [plasticTex, normalMap, roughnessMap].forEach((t) => (t.anisotropy = aniso));
  const surf = {
    map: plasticTex, normalMap, roughnessMap,
    normalScale: new THREE.Vector2(0.75, 0.75), envMapIntensity: 0.24,
  };
  const shellM = new THREE.MeshStandardMaterial({ ...surf, color: 0xc6c8c4, roughness: 0.82, metalness: 0.04 });
  const frameM = new THREE.MeshStandardMaterial({ ...surf, color: 0xbcbeba, roughness: 0.80, metalness: 0.04 });
  const panelM = new THREE.MeshStandardMaterial({ ...surf, color: 0xa4a6a2, roughness: 0.74, metalness: 0.06 });
  const blackM = new THREE.MeshStandardMaterial({ color: 0x1b1b18, roughness: 0.52, metalness: 0.12, envMapIntensity: 0.5 });
  const btnM   = new THREE.MeshStandardMaterial({ color: 0xd2d2cc, roughness: 0.44, metalness: 0.08, envMapIntensity: 0.55 });
  const redM   = new THREE.MeshStandardMaterial({ color: 0x9c352c, roughness: 0.5,  metalness: 0.06 });
  const footM  = new THREE.MeshStandardMaterial({ color: 0x2a2a25, roughness: 0.88, metalness: 0.04 });

  const CAB_W = 3.30, CAB_H = 3.34, CAB_D = 3.10;
  const SCR_W = 2.88, SCR_H = 2.16, SCR_R = 0.30;
  const SCR_X = 0, SCR_Y = 0.36, FRONT_Z = CAB_D / 2;

  /* body: the wedge back is the signature silhouette */
  {
    const g = new RoundedBoxGeometry(CAB_W, CAB_H, CAB_D, 6, 0.055);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      if (z < -0.01) {
        const t = Math.abs(z) / (CAB_D / 2);
        pos.setX(i, pos.getX(i) * (1 - 0.20 * t));
        if (pos.getY(i) > 0) pos.setY(i, pos.getY(i) * (1 - 0.46 * t));
      }
    }
    g.computeVertexNormals();
    tv.add(new THREE.Mesh(g, shellM));
  }
  { const fin = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.30, 0.62), shellM);
    fin.position.set(-CAB_W / 2 + 0.22, -0.55, -CAB_D / 2 - 0.22); tv.add(fin); }

  /* raised frame, tube recessed behind it */
  {
    const face = new THREE.Shape();
    face.moveTo(-1.59, -1.23); face.lineTo(1.59, -1.23);
    face.lineTo(1.59, 1.23);   face.lineTo(-1.59, 1.23); face.closePath();
    face.holes.push(roundedRect(SCR_W, SCR_H, SCR_R));
    const frame = new THREE.Mesh(
      new THREE.ExtrudeGeometry(face, { depth: 0.30, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.045, bevelSegments: 3 }),
      frameM);
    frame.position.set(SCR_X, SCR_Y, FRONT_Z - 0.02); tv.add(frame);
    const step = new THREE.Mesh(
      new THREE.ExtrudeGeometry(roundedRect(SCR_W + 0.10, SCR_H + 0.10, SCR_R + 0.04), { depth: 0.03, bevelEnabled: false }),
      blackM);
    step.position.set(SCR_X, SCR_Y, FRONT_Z + 0.005); tv.add(step);
  }

  /* control panel */
  {
    const PY = -1.32;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(3.06, 0.62, 0.05), panelM);
    panel.position.set(SCR_X, PY, FRONT_Z + 0.02); tv.add(panel);
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.075, 0.02), blackM);
    plate.position.set(SCR_X, PY + 0.24, FRONT_Z + 0.05); tv.add(plate);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.155, 0.025), blackM);
    bar.position.set(SCR_X - 0.10, PY + 0.10, FRONT_Z + 0.05); tv.add(bar);
    for (let i = 0; i < 14; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.115, 0.03), i >= 10 ? redM : btnM);
      b.position.set(SCR_X - 0.90 + i * 0.118, PY + 0.10, FRONT_Z + 0.068); tv.add(b);
    }
    for (const [x, w] of [[-0.92, 0.80], [-0.02, 0.80]] as const) {
      const slot = new THREE.Mesh(new THREE.BoxGeometry(w, 0.22, 0.025), blackM);
      slot.position.set(SCR_X + x, PY - 0.14, FRONT_Z + 0.05); tv.add(slot);
      const lip = new THREE.Mesh(new THREE.BoxGeometry(w - 0.05, 0.035, 0.02), panelM);
      lip.position.set(SCR_X + x, PY - 0.205, FRONT_Z + 0.072); tv.add(lip);
    }
    for (let i = 0; i < 7; i++) {
      const sl = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.17, 0.02), blackM);
      sl.position.set(SCR_X + 0.66 + i * 0.052, PY - 0.14, FRONT_Z + 0.05); tv.add(sl);
    }
  }
  for (let i = 0; i < 10; i++) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.026, 0.82), blackM);
    v.position.set(CAB_W / 2 - 0.03, -0.66 - i * 0.068, -0.22); tv.add(v);
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.085, 0.13, 12), footM);
    f.position.set(sx * 1.34, -CAB_H / 2 - 0.05, sz * 1.05); tv.add(f);
  }

  /* ---- screen ----------------------------------------------------------- */
  const SC = document.createElement('canvas'); SC.width = 640; SC.height = 480;
  const cx = SC.getContext('2d')!;
  const screenTex = new THREE.CanvasTexture(SC);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  screenTex.minFilter = THREE.LinearFilter;

  let phase: 'cipher' | 'decrypt' | 'plain' | 'encrypt' = 'cipher';
  let pTick = 0;
  let field = CIPHER.split('');
  const rnd = () => B64[(Math.random() * B64.length) | 0];

  function step() {
    if (reduced) { field = PLAIN.split(''); phase = 'plain'; return; }
    pTick++;
    if (phase === 'cipher') {
      field = CIPHER.split('').map((c) => (Math.random() < 0.06 ? rnd() : c));
      if (pTick > 26) { phase = 'decrypt'; pTick = 0; }
    } else if (phase === 'decrypt') {
      const n = Math.min(pTick, 16);
      field = Array.from({ length: 16 }, (_, i) => (i < n ? PLAIN[i] : rnd()));
      if (n >= 16) { phase = 'plain'; pTick = 0; }
    } else if (phase === 'plain') {
      field = PLAIN.split('');
      if (pTick > 34) { phase = 'encrypt'; pTick = 0; }
    } else {
      const n = Math.min(pTick, 16);
      field = Array.from({ length: 16 }, (_, i) => (i < 16 - n ? PLAIN[i] : rnd()));
      if (n >= 16) { field = CIPHER.split(''); phase = 'cipher'; pTick = 0; }
    }
  }
  const STATUS = { cipher: 'CIPHERTEXT', decrypt: 'DECRYPTING', plain: 'PLAINTEXT', encrypt: 'ENCRYPTING' };
  function paint() {
    cx.fillStyle = '#090806'; cx.fillRect(0, 0, 640, 480);
    cx.textAlign = 'center';
    cx.fillStyle = 'rgba(255,182,39,.45)'; cx.font = '600 22px ui-monospace,monospace';
    cx.fillText('AEGIS · AES-256-GCM', 320, 150);
    cx.fillStyle = '#FFB627'; cx.font = '700 52px ui-monospace,monospace';
    cx.fillText(field.join(''), 320, 262);
    cx.fillStyle = 'rgba(255,182,39,.52)'; cx.font = '600 20px ui-monospace,monospace';
    cx.fillText(STATUS[phase], 320, 340);
    cx.strokeStyle = 'rgba(255,182,39,.24)'; cx.lineWidth = 2;
    cx.beginPath(); cx.moveTo(150, 186); cx.lineTo(490, 186); cx.stroke();
    screenTex.needsUpdate = true;
  }
  step(); paint();

  const screenMat = new THREE.ShaderMaterial({
    uniforms: {
      tScreen: { value: screenTex }, uTime: { value: 0 }, uCurve: { value: 0.28 },
      uScan: { value: 0.22 }, uGrille: { value: 0.45 }, uAberr: { value: 0.5 },
      uHum: { value: 0.12 }, uNoise: { value: 0.10 }, uGlow: { value: 1.25 },
      uAspect: { value: SCR_W / SCR_H }, uRadius: { value: 0.30 }, uSheen: { value: 0.32 },
    },
    vertexShader: `varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform sampler2D tScreen;
      uniform float uTime,uCurve,uScan,uGrille,uAberr,uHum,uNoise,uGlow,uAspect,uRadius,uSheen;
      varying vec2 vUv;
      float roundedBox(vec2 p, vec2 b, float r){
        vec2 d = abs(p) - b + r;
        return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - r;
      }
      vec2 curve(vec2 uv){
        uv = uv*2.0-1.0;
        vec2 off = abs(uv.yx)/vec2(5.0,3.6);
        uv += uv*off*off*uCurve;
        return uv*0.5+0.5;
      }
      float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
      void main(){
        vec2 uv = curve(vUv);
        if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0){ gl_FragColor=vec4(0.0,0.0,0.0,1.0); return; }
        vec2 d = uv-0.5; float r2 = dot(d,d);
        float a = uAberr*r2*0.06;
        vec3 col;
        col.r = texture2D(tScreen, uv+d*a).r;
        col.g = texture2D(tScreen, uv).g;
        col.b = texture2D(tScreen, uv-d*a).b;
        float sl = sin((uv.y + uTime*0.015)*760.0);
        col *= 1.0 - uScan*(0.5+0.5*sl);
        float g = mod(gl_FragCoord.x, 3.0);
        vec3 mask = g<1.0 ? vec3(1.0,0.72,0.72) : (g<2.0 ? vec3(0.72,1.0,0.72) : vec3(0.72,0.72,1.0));
        col *= mix(vec3(1.0), mask, uGrille);
        float bar = fract(uv.y - uTime*0.05);
        col *= 1.0 + uHum*smoothstep(0.0,0.09,bar)*smoothstep(0.2,0.09,bar);
        float lum = dot(col, vec3(0.299,0.587,0.114));
        col += (hash(uv*vec2(640.0,480.0)+fract(uTime)*97.0)-0.5)*uNoise*(0.18+lum);
        col *= 1.0 - 1.15*r2;
        col *= 1.0 - 0.40*smoothstep(0.78, 1.0, vUv.y);
        float band = (vUv.x*0.78 + vUv.y*1.15) - 1.02;
        col += smoothstep(0.46, 0.0, abs(band)) * uSheen * vec3(0.82,0.86,0.95) * 0.34;
        vec2 pm = (vUv*2.0-1.0) * vec2(uAspect, 1.0);
        float sd = roundedBox(pm, vec2(uAspect, 1.0), uRadius);
        float tubeMask = 1.0 - smoothstep(-0.012, 0.012, sd);
        gl_FragColor = vec4(max(col,0.0)*uGlow*tubeMask, 1.0);
      }`,
    toneMapped: false,
  });

  const sg = new THREE.PlaneGeometry(SCR_W, SCR_H, 44, 32);
  {
    const p = sg.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / (SCR_W / 2), y = p.getY(i) / (SCR_H / 2);
      p.setZ(i, (1 - x * x * 0.5) * (1 - y * y * 0.5) * 0.115);
    }
    sg.computeVertexNormals();
  }
  const screen = new THREE.Mesh(sg, screenMat);
  /* FRONT_Z is the body's front FACE — anything behind it is inside the solid */
  screen.position.set(SCR_X, SCR_Y, FRONT_Z + 0.035);
  tv.add(screen);

  /* ---- post ------------------------------------------------------------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.40, 0.45, 1.0);
  composer.addPass(bloom);
  const composite = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null }, uGamma: { value: 0.622 }, uShift: { value: 0.05 },
      uAngle: { value: 1.02 }, uBright: { value: 1.10 }, uTint: { value: new THREE.Color(0xfff38a) },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float uGamma,uShift,uAngle,uBright; uniform vec3 uTint;
      varying vec2 vUv;
      void main(){
        vec2 dir = vec2(cos(uAngle),sin(uAngle))*uShift*0.008;
        vec4 base = texture2D(tDiffuse, vUv);
        vec3 c;
        c.r = texture2D(tDiffuse, vUv+dir).r;
        c.g = base.g;
        c.b = texture2D(tDiffuse, vUv-dir).b;
        c *= uBright;
        float lum = dot(c, vec3(0.2126,0.7152,0.0722));
        c = mix(c, c*uTint, smoothstep(0.90,1.0,lum));
        /* gamma is applied as 1/g: pow(c, 0.622) LIFTS to flat grey */
        gl_FragColor = vec4(pow(max(c,0.0), vec3(1.0/uGamma)), base.a);
      }`,
  });
  composer.addPass(composite);
  composer.addPass(new OutputPass());

  /* ---- pointer ---------------------------------------------------------- */
  const MAX_YAW = THREE.MathUtils.degToRad(18);
  const MAX_PITCH = THREE.MathUtils.degToRad(7);
  const DAMP = 6;
  const ptr = new THREE.Vector2();
  let engaged = false, lastMove = performance.now();

  const onMove = (e: PointerEvent) => {
    ptr.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    engaged = true; lastMove = performance.now();
  };
  const onLeave = () => { engaged = false; };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);

  /* ---- loop ------------------------------------------------------------- */
  const clock = new THREE.Clock();
  let acc = 0, raf = 0, visible = true;

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(host);

  /* The stage aspect varies with the hero layout, and a fixed camera distance
     crops the cabinet on narrow stages. Fit the object's bounds to whichever
     axis is tighter. */
  const FIT_W = 1.86, FIT_H = 1.94, MARGIN = 1.08;
  const resize = () => {
    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    const aspect = w / h;
    camera.aspect = aspect;
    const halfFov = THREE.MathUtils.degToRad(camera.fov) / 2;
    const distH = FIT_H / Math.tan(halfFov);
    const distW = FIT_W / (Math.tan(halfFov) * aspect);
    camera.position.z = Math.max(distH, distW) * MARGIN;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w, h);
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(host);

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!visible) return;                        // pause work when offscreen
    const dt = Math.min(clock.getDelta(), 0.1);
    const t = clock.elapsedTime;

    acc += dt;
    if (acc > 1 / 15) { acc = 0; step(); paint(); }   // ~15fps: a refresh rate, not an animation

    const idle = !engaged || performance.now() - lastMove > 2500;
    let tx: number, ty: number;
    if (idle && !reduced) {
      tx = Math.sin(t * 0.35) * MAX_YAW * 0.3;
      ty = Math.sin(t * 0.27 + 1.2) * MAX_PITCH * 0.3;
    } else if (idle) { tx = 0; ty = 0; }
    else { tx = ptr.x * MAX_YAW; ty = ptr.y * MAX_PITCH; }

    /* 1-exp(-k·dt), not a fixed-alpha lerp: framerate-independent */
    const k = 1 - Math.exp(-DAMP * dt);
    tv.rotation.y += (tx - tv.rotation.y) * k;
    tv.rotation.x += (ty - tv.rotation.x) * k;

    screenMat.uniforms.uTime.value = reduced ? 0 : t;
    composer.render();
  }
  frame();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect(); ro.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('blur', onLeave);
    composer.dispose();
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose();
    });
    renderer.dispose();
    host.removeChild(renderer.domElement);
  };
}

/* ---- helpers ------------------------------------------------------------ */
function roundedRect(w: number, h: number, r: number) {
  const x = w / 2, y = h / 2, sh = new THREE.Shape();
  sh.moveTo(-x + r, -y);
  sh.lineTo(x - r, -y);  sh.quadraticCurveTo(x, -y, x, -y + r);
  sh.lineTo(x, y - r);   sh.quadraticCurveTo(x, y, x - r, y);
  sh.lineTo(-x + r, y);  sh.quadraticCurveTo(-x, y, -x, y - r);
  sh.lineTo(-x, -y + r); sh.quadraticCurveTo(-x, -y, -x + r, -y);
  return sh;
}

function plasticTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512;
  const g = c.getContext('2d')!;
  g.fillStyle = '#adaeaa'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = Math.random() * 2.6;
    g.fillStyle = Math.random() < 0.55
      ? `rgba(84,86,82,${Math.random() * 0.16})`
      : `rgba(214,216,212,${Math.random() * 0.10})`;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 6 + Math.random() * 22;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(78,80,76,${0.03 + Math.random() * 0.06})`);
    rg.addColorStop(1, 'rgba(78,80,76,0)');
    g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  for (let i = 0; i < 80; i++) {
    g.strokeStyle = `rgba(232,230,220,${0.05 + Math.random() * 0.12})`;
    g.lineWidth = Math.random() * 1.2;
    const x = Math.random() * 512, y = Math.random() * 512;
    g.beginPath(); g.moveTo(x, y);
    g.lineTo(x + (Math.random() - 0.5) * 150, y + (Math.random() - 0.5) * 45); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Sobel over luminance -> normal map; the same signal drives roughness. */
function deriveMaps(src: HTMLCanvasElement) {
  const W = src.width, H = src.height;
  const data = src.getContext('2d')!.getImageData(0, 0, W, H).data;
  const lum = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++)
    lum[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;

  const nc = document.createElement('canvas'); nc.width = W; nc.height = H;
  const rc = document.createElement('canvas'); rc.width = W; rc.height = H;
  const nctx = nc.getContext('2d')!, rctx = rc.getContext('2d')!;
  const nd = nctx.createImageData(W, H), rd = rctx.createImageData(W, H);
  const at = (x: number, y: number) => lum[((y + H) % H) * W + ((x + W) % W)];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const dx = (at(x + 1, y) - at(x - 1, y)) * 2.6;
    const dy = (at(x, y + 1) - at(x, y - 1)) * 2.6;
    const len = Math.hypot(dx, dy, 1);
    nd.data[i * 4] = ((-dx / len) * 0.5 + 0.5) * 255;
    nd.data[i * 4 + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
    nd.data[i * 4 + 2] = ((1 / len) * 0.5 + 0.5) * 255;
    nd.data[i * 4 + 3] = 255;
    const r = Math.max(0, Math.min(1, 0.62 + (0.5 - lum[i]) * 0.85));
    rd.data[i * 4] = rd.data[i * 4 + 1] = rd.data[i * 4 + 2] = r * 255;
    rd.data[i * 4 + 3] = 255;
  }
  nctx.putImageData(nd, 0, 0); rctx.putImageData(rd, 0, 0);
  const mk = (c: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  };
  return { normalMap: mk(nc), roughnessMap: mk(rc) };
}
