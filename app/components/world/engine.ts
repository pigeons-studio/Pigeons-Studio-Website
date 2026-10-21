// @ts-nocheck — portage direct du prototype ORCA//GLYPH (three.js impératif)
// Le monde : des étages empilés, chacun avec son petit patch Orca vivant et son glyphe-menu As-Simt.
// En 3D la vue flotte sans tourner ; la molette traverse les étages ; un clic descend en vue de dessus (2D).
import * as THREE from 'three';
import GLYPHES from './glyphes.json';

export type Etage = { id: string; teinte: number; css: string; signe: string; nom: string; mot: string };

export type WorldOptions = {
  canvas: HTMLCanvasElement;
  tracker: HTMLElement;
  etages: Etage[];
  patchs: Record<string, string[]>;
  textes: { entrer: (e: number) => string };
  onMode: (mode: '3d' | 'vers2d' | '2d' | 'vers3d', etage: number) => void;
};

export type World = {
  descendre: (e: number) => void;
  changer: (e: number) => void;
  remonter: () => void;
  avancer: (pas: number) => void;
  etageVise: () => number;
  detruire: () => void;
};

const W = 16;
const D = 10;
const GAP = 2.7;
const G = 1.8;
const CASE = 0.4;
const NC = Math.floor(W / CASE);
const NR = Math.floor(D / CASE);
const SLOTS = 64;

const TOUS: Record<string, string[]> = { ...GLYPHES.symboles, ...GLYPHES.operateurs };
const CONTOUR = [[0.54, 1.165, 's'], [0.41, 1.215, 's'], [0.37, 1.265], [0.30, 1.295], [0.23, 1.28], [0.185, 1.22], [0.17, 1.12], [0.15, 1.02], [0.10, 0.93], [0.00, 0.86], [-0.12, 0.76], [-0.24, 0.60], [-0.36, 0.44], [-0.56, 0.17, 's'], [-0.61, 0.10, 's'], [-0.53, 0.07, 's'], [-0.34, 0.27], [-0.16, 0.34], [0.00, 0.31, 's'], [0.03, 0.06, 's'], [-0.05, 0.0, 's'], [0.17, 0.0, 's'], [0.17, 0.035, 's'], [0.09, 0.05, 's'], [0.08, 0.31, 's'], [0.18, 0.35], [0.31, 0.47], [0.385, 0.63], [0.39, 0.79], [0.345, 0.93], [0.31, 1.03], [0.335, 1.11], [0.41, 1.145, 's']];

function aretes (rows, s) {
  const on = (c, r) => r >= 0 && r < 8 && c >= 0 && c < 8 && rows[r][c] === '#';
  const v = s / 8; const pts = [];
  const X = (c) => -s / 2 + c * v; const Y = (r) => s / 2 - r * v;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (!on(c, r)) continue;
    if (!on(c, r - 1)) pts.push(X(c), Y(r), 0, X(c + 1), Y(r), 0);
    if (!on(c, r + 1)) pts.push(X(c), Y(r + 1), 0, X(c + 1), Y(r + 1), 0);
    if (!on(c - 1, r)) pts.push(X(c), Y(r), 0, X(c), Y(r + 1), 0);
    if (!on(c + 1, r)) pts.push(X(c + 1), Y(r), 0, X(c + 1), Y(r + 1), 0);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); return g;
}

// ce qu'est une case dans Orca : commentaire, opérateur, valeur, sortie
function nature (g, c, r) {
  const row = g[r]; let dans = false;
  for (let i = 0; i < c; i++) if (row[i] === '#') dans = !dans;
  const ch = row[c];
  if (ch === '#' || dans) return 'com';
  if (ch === ':' || ch === '*' || ch === '-') return 'out';
  if (/[A-Z]/.test(ch)) return 'op';
  return 'val';
}
const TEINTES = { com: [0x777777, 0.05], op: [0xeeeeee, 0.22], val: [0xaaaaaa, 0.12], out: [0xffb545, 0.18] };
const b36 = (ch) => { const n = parseInt(ch, 36); return isNaN(n) ? 0 : n; };

export function createWorld (opts: WorldOptions): World {
  const { canvas, tracker, etages: FAMILLES, patchs, textes, onMode } = opts;
  const N = FAMILLES.length;
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const trkTxt = tracker.querySelector('span');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 20, 60);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 400);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.3));
  const lum = new THREE.DirectionalLight(0xffffff, 1.4); lum.position.set(6, 14, 8); scene.add(lum);

  // ---------------------------------------------------------------- étages
  const pointGeo = new THREE.PlaneGeometry(0.035, 0.035); pointGeo.rotateX(-Math.PI / 2);
  const voxGeo = new THREE.BoxGeometry(CASE / 10, 1, CASE / 10); voxGeo.translate(0, 0.5, 0);
  const etages = FAMILLES.map((f, e) => {
    const grp = new THREE.Group(); scene.add(grp);
    const y0 = e * GAP;
    const plan = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ color: f.teinte, transparent: true, opacity: 0.04, depthWrite: false, side: THREE.DoubleSide }));
    plan.rotation.x = -Math.PI / 2;
    const pts = []; const t = 0.1;
    for (let x = -W / 2 + 1; x < W / 2; x += 2) for (let z = -D / 2 + 1; z < D / 2; z += 2) pts.push(x - t, 0, z, x + t, 0, z, x, 0, z - t, x, 0, z + t);
    const gc = new THREE.BufferGeometry(); gc.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const croix = new THREE.LineSegments(gc, new THREE.LineBasicMaterial({ color: 0x5a5953, transparent: true, opacity: 0.6 }));
    const bord = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(W, D)), new THREE.LineBasicMaterial({ color: f.teinte, transparent: true, opacity: 0.35 }));
    bord.rotation.x = -Math.PI / 2;
    const zone = new THREE.Mesh(new THREE.BoxGeometry(W, 0.3, D), new THREE.MeshBasicMaterial({ visible: false }));
    grp.add(plan, croix, bord, zone);
    const gly = new THREE.Group();
    const rows = GLYPHES.signes[f.signe];
    const trait = new THREE.LineSegments(aretes(rows, G), new THREE.LineBasicMaterial({ color: f.teinte, transparent: true }));
    const v = G / 8; const vox = [];
    rows.forEach((row, r) => [...row].forEach((c, q) => { if (c === '#') vox.push([-G / 2 + (q + 0.5) * v, G / 2 - (r + 0.5) * v]); }));
    const plein = new THREE.InstancedMesh(new THREE.BoxGeometry(v * 0.96, v * 0.96, v * 2), new THREE.MeshStandardMaterial({ color: f.teinte, transparent: true, emissive: f.teinte, emissiveIntensity: 0.25 }), vox.length);
    vox.forEach(([x, y], i) => { plein.setMatrixAt(i, new THREE.Matrix4().makeTranslation(x, y, 0)); });
    plein.scale.z = 0.001;
    const cible = new THREE.Mesh(new THREE.PlaneGeometry(G, G), new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }));
    gly.add(trait, plein, cible);
    gly.position.set(W / 2 + 1.6, G / 2 + 0.15, 0);
    grp.add(gly);
    const pied = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(W / 2, 0, 0), new THREE.Vector3(W / 2 + 1.6, 0, 0)]), new THREE.LineDashedMaterial({ color: f.teinte, dashSize: 0.1, gapSize: 0.1, transparent: true, opacity: 0.5 }));
    pied.computeLineDistances(); grp.add(pied);
    zone.userData.e = e; cible.userData.e = e;
    return { f, grp, y0, plan, croix, bord, gly, trait, plein, cible, zone, pied, chaud: 0, patch: construirePatch(f, grp) };
  });
  const cibles = etages.flatMap((x) => [x.cible, x.zone]);

  // ---------------------------------------------------------------- patchs Orca
  function construirePatch (f, grp) {
    const lignes = patchs[f.id] || [];
    const grille = Array.from({ length: NR }, (_, r) => Array.from({ length: NC }, (_, c) => (lignes[r] || '')[c] || '.'));
    const pris = []; const cle = new Map();
    const prendre = (c, r) => { const k = c + ',' + r; if (!cle.has(k) && c < NC && r < NR) { cle.set(k, pris.length); pris.push([c, r]); } };
    grille.forEach((row, r) => row.forEach((ch, c) => { if (ch !== '.') { prendre(c, r); if ('CDT'.includes(ch)) prendre(c, r + 1); } }));
    const m = new THREE.InstancedMesh(voxGeo, new THREE.MeshStandardMaterial({ roughness: 0.6, transparent: true }), Math.max(1, pris.length * SLOTS));
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const pts = new THREE.InstancedMesh(pointGeo, new THREE.MeshBasicMaterial({ color: 0x4a4946, transparent: true, depthWrite: false }), NR * NC);
    let i = 0;
    for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) pts.setMatrixAt(i++, new THREE.Matrix4().makeTranslation(-W / 2 + (c + 0.5) * CASE, 0.006, -D / 2 + (r + 0.5) * CASE));
    grp.add(pts, m);
    m.setColorAt(0, new THREE.Color());
    return { grille, pris, cle, m, pts, chaleur: new Float32Array(pris.length), sales: new Set(pris.map((_, j) => j)), tic: 0 };
  }
  const tmpO = new THREE.Object3D(); const ZERO = new THREE.Matrix4().makeScale(0, 0, 0); const cc = new THREE.Color(); const BL = new THREE.Color(0xffffff);
  function poserPatch (P) {
    if (!P.sales.size) return;
    for (const i of P.sales) {
      const [c, r] = P.pris[i];
      const ch = P.grille[r][c];
      const rows = ch === '.' ? null : TOUS[ch];
      let k = 0;
      if (rows) {
        const [col, h] = TEINTES[nature(P.grille, c, r)];
        cc.setHex(col);
        if (P.chaleur[i] > 0) cc.lerp(BL, P.chaleur[i] * 0.7);
        const v = CASE / 10;
        for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
          if (rows[y][x] !== '#') continue;
          tmpO.position.set(-W / 2 + c * CASE + v + (x + 0.5) * v, 0, -D / 2 + r * CASE + v + (y + 0.5) * v);
          tmpO.scale.set(1, h * (1 + P.chaleur[i] * 0.8), 1); tmpO.updateMatrix();
          P.m.setMatrixAt(i * SLOTS + k, tmpO.matrix); P.m.setColorAt(i * SLOTS + k, cc); k++;
        }
      }
      for (; k < SLOTS; k++) P.m.setMatrixAt(i * SLOTS + k, ZERO);
    }
    P.sales.clear();
    P.m.instanceMatrix.needsUpdate = true; P.m.instanceColor.needsUpdate = true;
  }
  function ecrire (P, c, r, ch) { const i = P.cle.get(c + ',' + r); if (i === undefined || P.grille[r][c] === ch) return; P.grille[r][c] = ch; P.sales.add(i); }
  function chauffer (P, c, r) { const i = P.cle.get(c + ',' + r); if (i !== undefined) { P.chaleur[i] = 1; P.sales.add(i); } }
  function ticPatch (P) {
    P.tic++;
    const g = P.grille; const f = P.tic; const bangs = [];
    for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
      const ch = g[r][c];
      if (nature(g, c, r) !== 'op') continue;
      const gauche = c > 0 ? g[r][c - 1] : '.'; const loin = c > 1 ? g[r][c - 2] : '.';
      if (ch === 'C') { const vit = Math.max(1, b36(loin)); const mod = b36(c + 1 < NC ? g[r][c + 1] : '.') || 10; ecrire(P, c, r + 1, (Math.floor(f / vit) % mod).toString(36)); }
      if (ch === 'D') { const vit = Math.max(1, b36(gauche)); const mod = b36(c + 1 < NC ? g[r][c + 1] : '.') || 8; const on = f % (vit * mod) === 0; ecrire(P, c, r + 1, on ? '*' : '.'); if (on) { chauffer(P, c, r); bangs.push([c, r + 1]); } }
      if (ch === 'T') { const len = Math.max(1, b36(gauche)); const k = f % len; const v = g[r][c + 1 + k]; ecrire(P, c, r + 1, v || '.'); chauffer(P, c + 1 + k, r); }
    }
    for (const [c, r] of bangs) {
      for (let rr = r; rr < Math.min(NR, r + 4); rr++) for (let dc = -2; dc < 16; dc++) { const ch = g[rr][c + dc]; if (ch === ':' || ch === '-') { chauffer(P, c + dc, rr); rr = NR; break; } }
    }
  }
  let accPatch = 0;
  function animerPatchs (dt) {
    if (!reduit) { accPatch += dt; const p = 60 / 120 / 4; while (accPatch > p) { accPatch -= p; etages.forEach((x) => ticPatch(x.patch)); } }
    etages.forEach((x) => {
      const P = x.patch;
      for (let i = 0; i < P.chaleur.length; i++) if (P.chaleur[i] > 0) { P.chaleur[i] = Math.max(0, P.chaleur[i] - dt * 3); P.sales.add(i); }
      poserPatch(P);
    });
  }

  // ---------------------------------------------------------------- le pigeon d'or
  const pigeon = (() => {
    const s = new THREE.Shape(); s.moveTo(CONTOUR[0][0], CONTOUR[0][1]); let run = [];
    for (let i = 1; i <= CONTOUR.length; i++) { const p = CONTOUR[i % CONTOUR.length]; run.push(new THREE.Vector2(p[0], p[1])); if (p[2] === 's') { s.splineThru(run); run = []; } }
    const o = new THREE.Path(); o.absarc(0.30, 1.205, 0.03, 0, Math.PI * 2, true); s.holes.push(o);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.012, bevelSegments: 2, curveSegments: 10 }); geo.translate(0, 0, -0.025);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xffb545, metalness: 0.85, roughness: 0.28, emissive: 0xffb545, emissiveIntensity: 0.35, transparent: true }));
    m.scale.setScalar(0.7); scene.add(m); return m;
  })();

  // ---------------------------------------------------------------- caméra : 3D flottante ⇄ vue de dessus
  const etat = { k: 0, de: 0, vers: 0, t: 1, duree: 1.3, etage: 0, mode: '3d', fin: null };
  let theta = 0.62; let flotte = 0;
  const ease = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const lerp = THREE.MathUtils.lerp;
  const dir = new THREE.Vector3(); const cib = new THREE.Vector3();
  let foc = 0; let focCible = 0; let focRepos = 0;
  const etageFoc = () => N - Math.max(1, foc);
  let survol = -1;
  function etageVise () { return survol >= 0 ? survol : (foc > 0.6 && etat.mode === '3d' ? Math.round(etageFoc()) : -1); }
  let largeur = 1; let hauteur = 1;
  function placerCamera () {
    const k = etat.k; const z = Math.min(1, foc); const a = camera.aspect;
    const fov = lerp(34, 9, k);
    const demi = Math.max((D + 3) / 2, (W + 5) / 2 / a);
    const distTop = demi / Math.tan(THREE.MathUtils.degToRad(fov / 2));
    const distOrb = Math.max(44, 12 / (Math.tan(THREE.MathUtils.degToRad(17)) * a));
    const dist = lerp(distOrb * lerp(1, 0.72, z), distTop, k);
    const th = lerp(theta, Math.round(theta / (Math.PI * 2)) * Math.PI * 2, ease(Math.min(1, k * 1.25)));
    const ph = lerp(0.5 + flotte, 1.5695, k);
    dir.set(Math.sin(th) * Math.cos(ph), Math.sin(ph), Math.cos(th) * Math.cos(ph));
    const yf = etages[etat.etage].y0;
    const y3d = lerp((N - 1) * GAP / 2 + flotte * 4, etageFoc() * GAP + 0.6, z);
    cib.set(lerp(1.4, 0, k), lerp(y3d, yf, k), 0);
    camera.fov = fov; camera.updateProjectionMatrix();
    camera.position.copy(cib).addScaledVector(dir, dist);
    camera.lookAt(cib);
    scene.fog.near = dist - 10; scene.fog.far = dist + 30;
  }
  function poserEtages (dt) {
    const k = etat.k;
    etages.forEach((x, e) => {
      const sel = e === etat.etage;
      x.grp.position.y = lerp(x.y0, etages[etat.etage].y0, sel ? 0 : k);
      const loin = Math.min(1, Math.abs(e - etageFoc())) * Math.min(1, foc) * (1 - k);
      const vis = (sel ? 1 : 1 - k) * (1 - 0.75 * loin);
      x.plan.material.opacity = 0.04 * vis * (1 - k);
      x.croix.material.opacity = 0.6 * vis * (1 - 0.8 * k);
      const mq = (1 - k) * (1 - 0.8 * loin) * (survol >= 0 && survol !== e && etat.mode === '3d' ? 0.45 : 1);
      x.patch.m.material.opacity = mq; x.patch.pts.material.opacity = mq;
      x.bord.material.opacity = 0.35 * vis * (1 - k);
      x.chaud += ((etageVise() === e && etat.mode === '3d' ? 1 : 0) - x.chaud) * (1 - Math.pow(0.0005, dt));
      const g = 1 - k;
      x.trait.material.opacity = g * (0.85 - 0.5 * x.chaud) * (1 - 0.7 * loin);
      x.pied.material.opacity = 0.5 * g;
      x.plein.material.opacity = g;
      x.plein.scale.z = Math.max(0.001, x.chaud);
      x.plein.visible = x.chaud > 0.01;
      x.gly.quaternion.copy(camera.quaternion);
      x.gly.scale.setScalar(1 + x.chaud * 0.12);
    });
  }

  // ---------------------------------------------------------------- pointeur
  const ray = new THREE.Raycaster(); const souris = new THREE.Vector2(9, 9);
  const viser = (e) => { const r = canvas.getBoundingClientRect(); souris.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); };
  const onMove = (e) => viser(e);
  const onLeave = () => souris.set(9, 9);
  const onWheel = (e) => {
    if (etat.mode !== '3d') return;
    e.preventDefault();
    focCible = THREE.MathUtils.clamp(focCible + e.deltaY / (e.deltaMode ? 3 : 240), 0, N); focRepos = 0;
  };
  // au doigt : glisser vers le haut ou le bas traverse les étages
  let depart = null; let glisse = false;
  const onDown = (e) => { depart = e.clientY; glisse = false; };
  const onUp = (e) => {
    if (depart === null || etat.mode !== '3d') { depart = null; return; }
    const dy = depart - e.clientY; depart = null;
    if (Math.abs(dy) > 40) { glisse = true; focCible = THREE.MathUtils.clamp(Math.round(focCible) + (dy > 0 ? 1 : -1), 0, N); focRepos = 0; }
  };
  const onClick = (e) => { if (glisse) { glisse = false; return; } viser(e); chercher(); if (etat.mode === '3d' && survol >= 0) descendre(survol); };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  function chercher () {
    if (etat.mode !== '3d' || souris.x > 2) { survol = -1; return; }
    ray.setFromCamera(souris, camera);
    const ici = foc > 0.6 ? Math.round(etageFoc()) : -1;
    const h = ray.intersectObjects(cibles, false).find((x) => ici < 0 || x.object.userData.e === ici || x.object === etages[x.object.userData.e].cible);
    survol = h ? h.object.userData.e : -1;
    canvas.style.cursor = survol >= 0 ? 'pointer' : '';
  }

  // ---------------------------------------------------------------- tracker (un seul, sur l'étage visé)
  let trkCle = '';
  const P = new THREE.Vector3();
  function suivre () {
    const sv = etageVise();
    if (!(sv >= 0 && etat.mode === '3d')) { tracker.classList.remove('on'); trkCle = ''; return; }
    const x = etages[sv];
    x.gly.getWorldPosition(P);
    const r = G / 2 * x.gly.scale.x + 0.1;
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const q = new THREE.Vector3(dx * r, dy * r, 0).applyQuaternion(camera.quaternion).add(P).project(camera);
      const sx = (q.x + 1) / 2 * largeur; const sy = (1 - q.y) / 2 * hauteur;
      x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
    }
    if (trkCle !== String(sv)) {
      trkCle = String(sv);
      const f = x.f;
      trkTxt.replaceChildren(document.createTextNode(f.mot + ' → ' + f.nom.toUpperCase()));
      const em = document.createElement('em'); em.textContent = textes.entrer(sv); trkTxt.append(em);
      tracker.style.setProperty('--c', f.css);
    }
    tracker.classList.add('on');
    const m = 6;
    tracker.style.transform = 'translate(' + (x0 - m) + 'px,' + (y0 - m) + 'px)';
    tracker.style.width = (x1 - x0 + 2 * m) + 'px'; tracker.style.height = (y1 - y0 + 2 * m) + 'px';
    const droite = x1 + 230 > largeur;
    trkTxt.style.left = droite ? 'auto' : '100%'; trkTxt.style.right = droite ? '100%' : 'auto';
    trkTxt.style.marginLeft = droite ? '0' : '10px'; trkTxt.style.marginRight = droite ? '10px' : '0'; trkTxt.style.textAlign = droite ? 'right' : 'left';
  }

  // ---------------------------------------------------------------- transitions
  function anim (vers, fin) { etat.de = etat.k; etat.vers = vers; etat.t = 0; etat.fin = fin; etat.duree = reduit ? 0.01 : 1.3; }
  function descendre (e) {
    survol = -1; etat.etage = e; etat.mode = 'vers2d'; onMode('vers2d', e);
    anim(1, () => { etat.mode = '2d'; onMode('2d', e); });
  }
  function changer (e) {
    etat.etage = e; focCible = N - e; foc = focCible;
    if (etat.mode === '2d') onMode('2d', e); else descendre(e);
  }
  function remonter () {
    focCible = N - etat.etage; foc = focCible;
    etat.mode = 'vers3d'; onMode('vers3d', etat.etage);
    anim(0, () => { etat.mode = '3d'; onMode('3d', etat.etage); });
  }
  function avancer (pas) {
    if (etat.mode !== '3d') return;
    focCible = THREE.MathUtils.clamp(Math.round(focCible) + pas, 0, N); focRepos = 0;
  }

  // ---------------------------------------------------------------- boucle
  function taille () {
    const r = canvas.parentElement.getBoundingClientRect();
    largeur = r.width; hauteur = r.height;
    renderer.setSize(largeur, hauteur, false); camera.aspect = largeur / hauteur;
  }
  const ro = new ResizeObserver(taille); ro.observe(canvas.parentElement); taille();
  const horloge = new THREE.Clock(); let temps = 0; let raf = 0;
  const vue = new THREE.Vector3(); const haut = new THREE.Vector3();
  function boucle () {
    const dt = Math.min(horloge.getDelta(), 0.05); temps += dt;
    if (etat.t < 1) { etat.t = Math.min(1, etat.t + dt / etat.duree); etat.k = lerp(etat.de, etat.vers, ease(etat.t)); if (etat.t >= 1 && etat.fin) { const f = etat.fin; etat.fin = null; f(); } }
    if (!reduit) { theta = 0.62 + Math.sin(temps * 0.13) * 0.07 + Math.sin(temps * 0.051) * 0.04; flotte = Math.sin(temps * 0.09) * 0.035; }
    if (etat.mode === '3d') { focRepos += dt; if (focRepos > 0.35) focCible += (Math.round(focCible) - focCible) * 0.15; }
    foc += (focCible - foc) * (1 - Math.pow(0.004, dt));
    placerCamera(); chercher(); poserEtages(dt); animerPatchs(dt);
    const p = etageVise() >= 0 ? etageVise() : 0;
    etages[p].gly.getWorldPosition(vue);
    pigeon.position.lerp(vue.add(haut.set(0, G / 2 * etages[p].gly.scale.x + 0.02, 0)), 0.12);
    if (!reduit) pigeon.position.y += Math.sin(temps * 2.2) * 0.004;
    pigeon.quaternion.copy(camera.quaternion);
    pigeon.material.opacity = 1 - etat.k; pigeon.visible = etat.k < 0.98;
    suivre();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(boucle);
  }
  boucle();

  return {
    descendre, changer, remonter, avancer, etageVise,
    detruire () {
      cancelAnimationFrame(raf); ro.disconnect();
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointerup', onUp);
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; if (Array.isArray(m)) m.forEach((x) => x.dispose()); else m?.dispose?.(); });
      renderer.dispose();
    },
  };
}
