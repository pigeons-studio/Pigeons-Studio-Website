// @ts-nocheck — scènes en temps réel des futurs projets (canvas 2D, même code que la page Claude)
// Chaque scène dessine le principe du projet, en direct : pas de vidéo.
import GLYPHES from './glyphes.json';

const SIG = GLYPHES.signes;
const TOUS = { ...GLYPHES.symboles, ...GLYPHES.operateurs };

const TEXTES = {
  fr: { sync: 'synchronisés', desync: 'désynchronisés', public: 'public', toi: 'toi', memoire: 'mémoire · 48 fragments', reponse: 'teammate',
    decisions: ['imiter', 'contraster', 'densifier', 's’éclaircir', 'se taire'],
    compos: [['musique', [['E0C8', 'caverne'], ['E11C', 'vibration'], ['E079', 'torse']]], ['heureux', [['E0B2', 'lumière'], ['E148', 'ouvrir'], ['E079', 'torse']]], ['voyage', [['E0E3', 'chemin'], ['E099', 'vent'], ['E08D', 'pied']]], ['futur', [['E0EE', 'graine'], ['E177', 'loin'], ['E0B2', 'lumière']]]],
    etage: 'étage' },
  en: { sync: 'in sync', desync: 'out of sync', public: 'audience', toi: 'you', memoire: 'memory · 48 fragments', reponse: 'teammate',
    decisions: ['imitate', 'contrast', 'densify', 'thin out', 'stay silent'],
    compos: [['music', [['E0C8', 'cave'], ['E11C', 'vibration'], ['E079', 'chest']]], ['happy', [['E0B2', 'light'], ['E148', 'open'], ['E079', 'chest']]], ['journey', [['E0E3', 'path'], ['E099', 'wind'], ['E08D', 'foot']]], ['future', [['E0EE', 'seed'], ['E177', 'far'], ['E0B2', 'light']]]],
    etage: 'floor' },
};

const GRIS = '#8a8780'; const SOMBRE = '#2c2b29'; const ENCRE = '#f2f0ea'; const OR = '#ffb545';

function bits (ctx, rows, x, y, px, couleur, part = 1, graine = 0) {
  if (!rows) return;
  ctx.fillStyle = couleur;
  let k = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (rows[r][c] !== '#') continue;
    k++;
    // apparition pixel par pixel, dans un ordre pseudo-aléatoire stable
    if (part < 1 && ((k * 37 + graine * 11) % 100) / 100 > part) continue;
    ctx.fillRect(x + c * px, y + r * px, px, px);
  }
}

function points (ctx, w, h, pas) {
  ctx.fillStyle = '#1c1b19';
  for (let y = pas / 2; y < h; y += pas) for (let x = pas / 2; x < w; x += pas) ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
}

function texte (ctx, s, x, y, couleur, taille = 10, align = 'left') {
  ctx.fillStyle = couleur; ctx.font = `${taille}px 'IBM Plex Mono', ui-monospace, monospace`; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}

// ---------------------------------------------------------------- ORCA//GLYPH : trois étages de grille qui jouent, reliés par leurs bangs
function orca (ctx, w, h, t, etat, css, L) {
  if (!etat.init) {
    etat.init = true;
    etat.etages = [
      ['..1D4.....', '..........', '...:03C...'],
      ['.4C8......', '..........', '.....1D8..'],
      ['..2C4..D2.', '..........', '......:14.'],
    ].map((l) => l.map((r) => [...r]));
    etat.tic = 0; etat.acc = 0; etat.chaud = {}; etat.liens = [];
  }
  etat.acc += etat.dt;
  while (etat.acc > 0.125) {
    etat.acc -= 0.125; etat.tic++;
    etat.etages.forEach((g, e) => {
      for (let r = 0; r < g.length; r++) for (let c = 0; c < g[r].length; c++) {
        const ch = g[r][c];
        if (ch === 'C') { const vit = parseInt(g[r][c - 1] || '1', 36) || 1; const mod = parseInt(g[r][c + 1] || 'a', 36) || 10; if (g[r + 1]) g[r + 1][c] = (Math.floor(etat.tic / vit) % mod).toString(36); }
        if (ch === 'D') { const vit = parseInt(g[r][c - 1] || '1', 36) || 1; const mod = parseInt(g[r][c + 1] || '8', 36) || 8; const on = etat.tic % (vit * mod) === 0; if (g[r + 1]) g[r + 1][c] = on ? '*' : '.'; if (on) { etat.chaud[e + ',' + (r + 1) + ',' + c] = 1; if (e < 2) etat.liens.push({ e, c, vie: 1 }); } }
      }
    });
  }
  for (const k in etat.chaud) { etat.chaud[k] -= etat.dt * 2.5; if (etat.chaud[k] <= 0) delete etat.chaud[k]; }
  etat.liens = etat.liens.filter((l) => (l.vie -= etat.dt * 1.6) > 0);

  // les étages, vus en perspective cavalière, du bas vers le haut
  const cell = Math.min(w / 13, 18); const px = cell / 10;
  const ox = w * 0.12; const sk = 0.55; const ecart = h * 0.27;
  const base = h * 0.86;
  const pos = (e, r, c) => [ox + c * cell + r * cell * sk, base - e * ecart - (2 - r) * cell * 0.62];
  for (let e = 0; e < 3; e++) {
    const g = etat.etages[e];
    // la dalle
    const [x0, y0] = pos(e, -0.5, -0.5); const [x1, y1] = pos(e, -0.5, 10); const [x2, y2] = pos(e, 2.6, 10); const [x3, y3] = pos(e, 2.6, -0.5);
    ctx.strokeStyle = e === 2 ? css : SOMBRE; ctx.globalAlpha = e === 2 ? 0.7 : 1;
    ctx.beginPath(); ctx.moveTo(x0, y0 + cell); ctx.lineTo(x1, y1 + cell); ctx.lineTo(x2, y2 + cell); ctx.lineTo(x3, y3 + cell); ctx.closePath(); ctx.stroke();
    ctx.globalAlpha = 1;
    for (let r = 0; r < g.length; r++) for (let c = 0; c < g[r].length; c++) {
      const ch = g[r][c]; const [x, y] = pos(e, r, c);
      if (ch === '.') { ctx.fillStyle = '#2a2927'; ctx.fillRect(x + cell / 2 - 0.7, y + cell / 2 - 0.7, 1.4, 1.4); continue; }
      const chaud = etat.chaud[e + ',' + r + ',' + c] || 0;
      const col = chaud > 0 ? ENCRE : /[A-Z]/.test(ch) ? ENCRE : ch === ':' || ch === '*' ? OR : GRIS;
      bits(ctx, TOUS[ch], x + px, y + px, px * 0.95, col);
    }
    texte(ctx, `${L.etage} ${e}`, w - 8, base - e * ecart + cell * 0.2, e === 2 ? css : GRIS, 9, 'right');
  }
  // un bang relie son étage à celui du dessus
  for (const l of etat.liens) {
    const [xa, ya] = pos(l.e, 1, l.c); const [xb, yb] = pos(l.e + 1, 1, l.c);
    ctx.strokeStyle = css; ctx.globalAlpha = l.vie; ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(xa + cell / 2, ya); ctx.lineTo(xb + cell / 2, yb + cell); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------- CAVE // FOUR ROBOTS : quatre robots autour du public, leurs sons dans la grotte
function cave (ctx, w, h, t, etat, css, L) {
  const cx = w / 2; const cy = h * 0.47; const R = Math.min(w, h) * 0.42;
  if (!etat.init) {
    etat.init = true;
    etat.bord = Array.from({ length: 48 }, (_, i) => { const a = i / 48 * Math.PI * 2; return 1 + 0.12 * Math.sin(a * 3 + 1) + 0.07 * Math.sin(a * 7 + 2) + 0.04 * Math.sin(a * 13); });
    etat.public = Array.from({ length: 26 }, (_, i) => [Math.cos(i * 2.4) * (4 + (i % 5) * 3.2), Math.sin(i * 2.4) * (4 + (i % 5) * 3.2)]);
    etat.ondes = []; etat.dernier = [0, 0, 0, 0];
  }
  const sync = Math.floor(t / 7) % 2 === 0;
  // la grotte
  ctx.strokeStyle = SOMBRE; ctx.lineWidth = 1.5; ctx.beginPath();
  etat.bord.forEach((k, i) => { const a = i / 48 * Math.PI * 2; const x = cx + Math.cos(a) * R * k * 1.12; const y = cy + Math.sin(a) * R * k; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
  ctx.closePath(); ctx.stroke(); ctx.lineWidth = 1;
  // les ondes, que la roche renvoie
  etat.ondes = etat.ondes.filter((o) => (o.r += etat.dt * R * 0.55) < R * 1.3);
  for (const o of etat.ondes) { ctx.strokeStyle = css; ctx.globalAlpha = Math.max(0, 0.55 * (1 - o.r / (R * 1.3))); ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.stroke(); }
  ctx.globalAlpha = 1;
  // le public au centre
  ctx.fillStyle = GRIS; for (const [x, y] of etat.public) ctx.fillRect(cx + x - 1, cy + y - 1, 2, 2);
  texte(ctx, L.public, cx, cy + 30, GRIS, 9, 'center');
  // les quatre robots, chacun avec son mégaphone tourné vers le public
  for (let i = 0; i < 4; i++) {
    const vit = sync ? 0.32 : [0.21, 0.37, 0.29, 0.45][i];
    const a = t * vit + i * Math.PI / 2;
    const rr = R * (0.62 + (sync ? 0.06 : 0.12 * Math.sin(t * 0.8 + i)));
    const x = cx + Math.cos(a) * rr * 1.1; const y = cy + Math.sin(a) * rr;
    const per = sync ? 1.6 : [1.1, 1.9, 1.4, 2.3][i];
    if (t - etat.dernier[i] > per) { etat.dernier[i] = sync ? Math.floor(t / per) * per : t; etat.ondes.push({ x, y, r: 4 }); }
    const vers = Math.atan2(cy - y, cx - x);
    ctx.save(); ctx.translate(x, y); ctx.rotate(vers);
    ctx.fillStyle = ENCRE; ctx.fillRect(-5, -3.5, 10, 7);
    ctx.fillStyle = css; ctx.beginPath(); ctx.moveTo(5, -2); ctx.lineTo(11, -5); ctx.lineTo(11, 5); ctx.lineTo(5, 2); ctx.closePath(); ctx.fill();
    ctx.restore();
    texte(ctx, '0' + (i + 1), x, y - 9, GRIS, 8, 'center');
  }
  texte(ctx, sync ? L.sync : L.desync, 10, h - 10, css, 10);
}

// ---------------------------------------------------------------- Langue des images : un concept se compose de trois images
function langue (ctx, w, h, t, etat, css, L) {
  const DUREE = 4.5;
  const n = Math.floor(Math.max(0, t) / DUREE) % L.compos.length; const u = (t % DUREE) / DUREE;
  const [mot, images] = L.compos[n];
  const px = Math.max(3, Math.floor(Math.min(w / 34, h / 40)));
  const taille = px * 8; const gap = taille * 0.45;
  const total = taille * 3 + gap * 2; const x0 = (w - total) / 2; const y0 = h * 0.28;
  images.forEach(([signe, nom], i) => {
    const debut = 0.08 + i * 0.16; const part = Math.min(1, Math.max(0, (u - debut) / 0.14));
    const x = x0 + i * (taille + gap);
    bits(ctx, SIG[signe], x, y0, px, part >= 1 ? ENCRE : css, part, i + n * 3);
    if (part > 0.3) texte(ctx, nom, x + taille / 2, y0 + taille + 16, GRIS, 9, 'center');
    if (i < 2 && part >= 1) texte(ctx, '·', x + taille + gap / 2, y0 + taille / 2 + 4, GRIS, 14, 'center');
  });
  if (u > 0.62) {
    const a = Math.min(1, (u - 0.62) / 0.12);
    ctx.globalAlpha = a;
    texte(ctx, '=', w / 2, y0 + taille + 46, GRIS, 14, 'center');
    texte(ctx, mot.toUpperCase(), w / 2, y0 + taille + 74, css, 16, 'center');
    ctx.globalAlpha = 1;
  }
  texte(ctx, `${n + 1} / ${L.compos.length}`, w - 10, h - 10, GRIS, 9, 'right');
}

// ---------------------------------------------------------------- TEAMMATE.POTO : écouter, se souvenir, répondre
function teammate (ctx, w, h, t, etat, css, L) {
  const CYCLE = 6;
  const k = Math.floor(t / CYCLE); const u = (t % CYCLE) / CYCLE;
  if (etat.k !== k) {
    etat.k = k;
    let s = k * 9301 + 49297; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    etat.phrase = Array.from({ length: 12 }, () => 0.2 + rnd() * 0.8);
    etat.decision = k % L.decisions.length;
  }
  const pad = 12; const larg = w - pad * 2;
  // toi : la phrase jouée, note après note
  texte(ctx, L.toi, pad, 18, GRIS, 9);
  const vus = Math.min(12, Math.floor(u / 0.35 * 12));
  const bw = larg / 12;
  for (let i = 0; i < vus; i++) { const hh = etat.phrase[i] * h * 0.16; ctx.fillStyle = ENCRE; ctx.fillRect(pad + i * bw + 1, 26 + h * 0.16 - hh, bw - 3, hh); }
  // la mémoire de 48 fragments
  const my = h * 0.36;
  texte(ctx, L.memoire, pad, my - 6, GRIS, 9);
  const cw = larg / 8; const ch = h * 0.045;
  for (let i = 0; i < 48; i++) {
    const c = i % 8; const r = Math.floor(i / 8);
    const plein = u > 0.35 && i < Math.floor(Math.min(1, (u - 0.35) / 0.2) * 48);
    const v = etat.phrase[i % 12];
    ctx.fillStyle = plein ? css : SOMBRE; ctx.globalAlpha = plein ? 0.25 + v * 0.75 : 1;
    ctx.fillRect(pad + c * cw + 1, my + r * (ch + 2), cw - 3, ch);
  }
  ctx.globalAlpha = 1;
  // la décision, puis la réponse
  const ry = my + 6 * (ch + 2) + 26;
  if (u > 0.58) {
    texte(ctx, `${L.reponse} → ${L.decisions[etat.decision]}`, pad, ry, css, 10);
    const d = etat.decision; const ph = etat.phrase;
    const rep = d === 0 ? ph : d === 1 ? ph.map((v) => 1.2 - v) : d === 2 ? ph.flatMap((v) => [v, v * 0.7]) : d === 3 ? ph.filter((_, i) => i % 3 === 0) : [];
    const vis = Math.floor(Math.min(1, (u - 0.62) / 0.3) * rep.length);
    const bw2 = larg / Math.max(12, rep.length);
    for (let i = 0; i < vis; i++) { const hh = Math.max(0.1, rep[i]) * h * 0.16; ctx.fillStyle = css; ctx.fillRect(pad + i * bw2 + 1, ry + 8 + h * 0.16 - hh, bw2 - 3, hh); }
    if (d === 4) texte(ctx, '…', pad, ry + 30, GRIS, 14);
  }
}

const SCENES = { orca, cave, langue, teammate };

export function lancerScene (canvas, id, css, locale) {
  const ctx = canvas.getContext('2d'); if (!ctx) return () => {};
  const L = TEXTES[locale] || TEXTES.fr;
  const f = SCENES[id]; if (!f) return () => {};
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const etat = { dt: 0 };
  let w = 0; let h = 0; let raf = 0; let avant = performance.now(); let t = reduit ? 2.6 : 0;
  const taille = () => { const d = Math.min(devicePixelRatio, 2); w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = Math.round(w * d); canvas.height = Math.round(h * d); ctx.setTransform(d, 0, 0, d, 0, 0); };
  const ro = new ResizeObserver(taille); ro.observe(canvas); taille();
  const dessiner = () => { ctx.clearRect(0, 0, w, h); points(ctx, w, h, 14); f(ctx, w, h, t, etat, css, L); };
  const boucle = (now) => { const dt = Math.max(0, Math.min((now - avant) / 1000, 0.1)); avant = now; t += dt; etat.dt = dt; dessiner(); raf = requestAnimationFrame(boucle); };
  if (reduit) { etat.dt = 0.016; dessiner(); } else raf = requestAnimationFrame(boucle);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}
