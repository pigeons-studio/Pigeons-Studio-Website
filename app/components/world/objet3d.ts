// @ts-nocheck — l'objet réel d'un projet, en 3D, dessiné comme le reste du site : du noir, des arêtes fines, des couleurs d'accent.
// Le modèle est un binaire compact (positions quantifiées sur 16 bits, indices 16 bits), préparé depuis le fichier FBX du projet.
import * as THREE from 'three';

const COULEURS = { coque: 0x8a8780, metal: 0xf2f0ea, or: 0xffb545 }; // l'écran prend la couleur de la rubrique

export function lancerObjet (canvas, url, css) {
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 1, 2000);
  const pivot = new THREE.Group(); scene.add(pivot);
  let rayon = 100; let arret = false; let raf = 0;

  fetch(url).then((r) => r.arrayBuffer()).then((buf) => {
    if (arret) return;
    const dv = new DataView(buf); const n = dv.getUint32(0, true);
    const tete = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, n)));
    const base = 4 + n; const { min, max } = tete; const ech = [0, 1, 2].map((a) => (max[a] - min[a]) || 1);
    const centre = new THREE.Vector3((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2);
    rayon = Math.hypot(ech[0], ech[1], ech[2]) / 2;
    for (const p of tete.parties) {
      const q = new Uint16Array(buf, base + p.pos, p.nv * 3); const pos = new Float32Array(p.nv * 3);
      for (let i = 0; i < q.length; i++) { const a = i % 3; pos[i] = min[a] + q[i] / 65535 * ech[a] - centre.getComponent(a); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setIndex(new THREE.BufferAttribute(new Uint16Array(buf, base + p.idx, p.ni), 1));
      // un plein noir qui cache les arêtes de derrière, puis les arêtes vives par-dessus
      const plein = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: p.nom === 'ecran' ? new THREE.Color(css).multiplyScalar(0.35) : 0x000000, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
      const aretes = new THREE.LineSegments(new THREE.EdgesGeometry(g, 28), new THREE.LineBasicMaterial({ color: p.nom === 'ecran' ? new THREE.Color(css) : COULEURS[p.nom], transparent: true, opacity: p.nom === 'metal' ? 0.55 : 0.9 }));
      pivot.add(plein, aretes);
    }
    taille();
  });

  // glisser pour tourner ; sinon, l'objet tourne lentement et flotte, comme les étages du site
  let theta = 0.6; let phi = 0.32; let tire = null; let repos = 0;
  const bas = (e) => { tire = [e.clientX, e.clientY, theta, phi]; canvas.setPointerCapture?.(e.pointerId); };
  const bouge = (e) => { if (!tire) return; theta = tire[2] + (e.clientX - tire[0]) * 0.01; phi = Math.max(-0.6, Math.min(1.2, tire[3] + (e.clientY - tire[1]) * 0.006)); repos = 0; };
  const haut = () => { tire = null; };
  canvas.addEventListener('pointerdown', bas); canvas.addEventListener('pointermove', bouge);
  canvas.addEventListener('pointerup', haut); canvas.addEventListener('pointercancel', haut);

  function taille () {
    const w = canvas.clientWidth; const h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const d = rayon / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * (camera.aspect < 1 ? 1.25 / camera.aspect : 1.05);
    camera.userData.d = d; camera.near = d / 50; camera.far = d * 4; camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(taille); ro.observe(canvas); taille();
  const horloge = new THREE.Clock(); let t = 0;
  const boucle = () => {
    const dt = Math.min(horloge.getDelta(), 0.05); t += dt; repos += dt;
    if (!tire && !reduit && repos > 1.5) theta += dt * 0.25;
    const d = camera.userData.d || 300; const f = reduit ? 0 : Math.sin(t * 0.6) * 0.03;
    camera.position.set(Math.sin(theta) * Math.cos(phi + f) * d, Math.sin(phi + f) * d, Math.cos(theta) * Math.cos(phi + f) * d);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(boucle);
  };
  boucle();
  return () => {
    arret = true; cancelAnimationFrame(raf); ro.disconnect();
    canvas.removeEventListener('pointerdown', bas); canvas.removeEventListener('pointermove', bouge);
    canvas.removeEventListener('pointerup', haut); canvas.removeEventListener('pointercancel', haut);
    scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); }); renderer.dispose();
  };
}
