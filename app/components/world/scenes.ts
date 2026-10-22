// @ts-nocheck — scènes en temps réel des futurs projets (canvas 2D, même code que la page Claude)
// Chaque scène dessine le principe du projet, en direct : pas de vidéo.
// À côté de la scène, un panneau « comment ça marche » : les étapes s'allument au rythme de l'animation.
import GLYPHES from './glyphes.json';

const SIG = GLYPHES.signes;
const TOUS = { ...GLYPHES.symboles, ...GLYPHES.operateurs };

const TEXTES = {
  fr: {
    panneau: 'comment ça marche', legende: 'légende',
    sync: 'synchronisés', desync: 'désynchronisés', public: 'public', toi: 'toi', memoire: 'mémoire · 48 fragments', reponse: 'teammate',
    decisions: ['imiter', 'contraster', 'densifier', 's’éclaircir', 'se taire'],
    traits: ['hauteur', 'énergie', 'timbre', 'texture'],
    sens: { C: 'battement', D: 'pluie' },
    parole: ['hello agent', 'i’m listening…', 'too repetitive!', 'nice agent!', 'my turn!'],
    humeur: 'humeur', humeurs: ['curieuse', 'stressée', 'joueuse'],
    metabo: 'avatar métabolique', etats: ['STABLE', 'MONOTONE'], voiesNotes: '7 voies = 7 notes',
    voies: ['growth', 'glycolysis', 'respiration', 'fermentation', 'byproduct', 'co2', 'lactate'],
    compos: [['musique', [['E0C8', 'caverne'], ['E11C', 'vibration'], ['E079', 'torse']]], ['heureux', [['E0B2', 'lumière'], ['E148', 'ouvrir'], ['E079', 'torse']]], ['voyage', [['E0E3', 'chemin'], ['E099', 'vent'], ['E08D', 'pied']]], ['futur', [['E0EE', 'graine'], ['E177', 'loin'], ['E0B2', 'lumière']]]],
    etage: 'étage',
    orca: {
      etapes: ['Un langage de code à nous : chaque opérateur est un glyphe As-Simt qui porte un sens. C, c’est « battement » ; D, « pluie ». Coder, c’est écrire avec des images.',
        'ORCA//GLYPH la lève en volume : les grilles s’empilent en étages, une couche du morceau par étage, et l’on circule dedans.',
        'Les données prennent du relief : chaque glyphe est extrudé, d’autant plus haut que sa valeur compte. On lit la musique comme une architecture.',
        'Les bangs voyagent dans l’espace : on les voit monter d’un étage à l’autre. Le signal devient visible, et part en MIDI vers les synthés.'],
      legende: [['encre', 'opérateur'], ['gris', 'valeur'], ['or', 'bang qui voyage'], ['css', 'sens du glyphe']],
    },

    cave: {
      etapes: ['Le public se tient au centre de la grotte.',
        'Quatre robots-chiens Unitree, un mégaphone sur le dos, tournent autour de lui.',
        'Synchronisés : ils jouent ensemble, le son se rassemble en une seule vague.',
        'Désynchronisés : chacun son tempo, le son se disperse et la roche le renvoie.'],
      legende: [['encre', 'robot + mégaphone'], ['css', 'onde sonore'], ['gris', 'public'], ['sombre', 'paroi de la grotte']],
    },
    langue: {
      etapes: ['Une langue sans mots abstraits : on ne dit que des images concrètes.',
        'Chaque image a son signe : un damier 8 × 8 de l’alphabet As-Simt.',
        'Trois images au plus se posent côte à côte…',
        '…et forment un concept. On le lit comme une petite scène.'],
      legende: [['css', 'signe qui s’écrit'], ['encre', 'signe posé']],
    },
    teammate: {
      etapes: ['Une créature vit dans le Norns : un visage, une humeur, des opinions, un niveau qui monte. Un tamagotchi pour improvisateurs.',
        'Tu joues : elle écoute et range ta phrase en 48 fragments (hauteur, énergie, timbre, texture).',
        'METABO, son avatar métabolique : ton son nourrit une cellule dont les voies sont des notes. Jeu monotone, elle stresse et accélère ; jeu varié, elle se calme.',
        'Tu t’arrêtes : elle décide et répond avec tes fragments, te parle, gagne de l’XP. Une composition électronique à deux, en temps réel.'],
      legende: [['encre', 'ta phrase'], ['css', 'mémoire · réponse'], ['or', 'stress de la cellule'], ['sombre', 'case vide']],
    },

  },
  en: {
    panneau: 'how it works', legende: 'key',
    sync: 'in sync', desync: 'out of sync', public: 'audience', toi: 'you', memoire: 'memory · 48 fragments', reponse: 'teammate',
    decisions: ['imitate', 'contrast', 'densify', 'thin out', 'stay silent'],
    traits: ['pitch', 'energy', 'timbre', 'texture'],
    sens: { C: 'beat', D: 'rain' },
    parole: ['hello agent', 'i’m listening…', 'too repetitive!', 'nice agent!', 'my turn!'],
    humeur: 'mood', humeurs: ['curious', 'stressed', 'playful'],
    metabo: 'metabolic avatar', etats: ['STABLE', 'MONOTONE'], voiesNotes: '7 pathways = 7 notes',
    voies: ['growth', 'glycolysis', 'respiration', 'fermentation', 'byproduct', 'co2', 'lactate'],
    compos: [['music', [['E0C8', 'cave'], ['E11C', 'vibration'], ['E079', 'chest']]], ['happy', [['E0B2', 'light'], ['E148', 'open'], ['E079', 'chest']]], ['journey', [['E0E3', 'path'], ['E099', 'wind'], ['E08D', 'foot']]], ['future', [['E0EE', 'seed'], ['E177', 'far'], ['E0B2', 'light']]]],
    etage: 'floor',
    orca: {
      etapes: ['A code language of our own: each operator is an As-Simt glyph that carries a meaning. C is “beat”; D, “rain”. Coding means writing with images.',
        'ORCA//GLYPH lifts it into volume: grids stack up as floors, one layer of the track per floor, and you move inside.',
        'Data takes on relief: each glyph is extruded, taller the more its value counts. You read the music like architecture.',
        'Bangs travel through space: you see them rise from one floor to the next. The signal becomes visible, and goes out as MIDI to the synths.'],
      legende: [['encre', 'operator'], ['gris', 'value'], ['or', 'travelling bang'], ['css', 'glyph meaning']],
    },

    cave: {
      etapes: ['The audience stands in the middle of the cave.',
        'Four Unitree robot dogs, each carrying a megaphone, move around them.',
        'In sync: they play together, the sound gathers into one wave.',
        'Out of sync: each its own tempo, the sound scatters and the rock sends it back.'],
      legende: [['encre', 'robot + megaphone'], ['css', 'sound wave'], ['gris', 'audience'], ['sombre', 'cave wall']],
    },
    langue: {
      etapes: ['A language with no abstract words: you only say concrete images.',
        'Each image has its sign: an 8 × 8 grid from the As-Simt alphabet.',
        'Up to three images sit side by side…',
        '…and make a concept. You read it like a small scene.'],
      legende: [['css', 'sign being written'], ['encre', 'sign in place']],
    },
    teammate: {
      etapes: ['A creature lives in the Norns: a face, a mood, opinions, a level that rises. A tamagotchi for improvisers.',
        'You play: it listens and stores your phrase as 48 fragments (pitch, energy, timbre, texture).',
        'METABO, its metabolic avatar: your sound feeds a cell whose pathways are notes. Play monotonously and it stresses and speeds up; play varied and it calms down.',
        'You stop: it decides and answers with your fragments, talks to you, gains XP. Electronic composition for two, in real time.'],
      legende: [['encre', 'your phrase'], ['css', 'memory · answer'], ['or', 'cell stress'], ['sombre', 'empty slot']],
    },

  },
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

function texte (ctx, s, x, y, couleur, taille = 11, align = 'left', style = '') {
  ctx.fillStyle = couleur; ctx.font = `${style}${taille}px 'IBM Plex Mono', ui-monospace, monospace`; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}

// coupe un texte en lignes qui tiennent dans la largeur donnée
function couper (ctx, s, larg) {
  const mots = s.split(' '); const lignes = []; let l = '';
  for (const m of mots) { const essai = l ? l + ' ' + m : m; if (ctx.measureText(essai).width > larg && l) { lignes.push(l); l = m; } else l = essai; }
  if (l) lignes.push(l);
  return lignes;
}

// un cadre d'annotation, comme le tracker du site
function viseur (ctx, x, y, w, h, couleur, alpha = 1) {
  const m = Math.min(8, w / 3, h / 3);
  ctx.strokeStyle = couleur; ctx.globalAlpha = alpha; ctx.lineWidth = 1; ctx.beginPath();
  ctx.moveTo(x, y + m); ctx.lineTo(x, y); ctx.lineTo(x + m, y);
  ctx.moveTo(x + w - m, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + m);
  ctx.moveTo(x + w, y + h - m); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - m, y + h);
  ctx.moveTo(x + m, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - m);
  ctx.stroke(); ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------- ORCA//GLYPH : Orca quitte le plan, ses données et ses bangs prennent corps dans l'espace
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
  // un cycle de 20 s : à plat, la levée en étages, le relief des données, les bangs qui voyagent
  const ph = t % 20; const actif = Math.floor(ph / 5); const ts = ph - actif * 5;
  const lisse = (x) => x * x * (3 - 2 * x);
  let m = actif === 0 ? 0 : actif === 1 ? lisse(Math.min(1, ts / 2)) : 1;
  if (actif === 3 && ts > 3.8) m = 1 - lisse(Math.min(1, (ts - 3.8) / 1.2));
  const ext = actif === 2 ? lisse(Math.min(1, ts / 1.5)) : actif === 3 ? m : 0;

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
  etat.liens = etat.liens.filter((l) => (l.vie -= etat.dt * 0.9) > 0);

  const cell = Math.min(w / 14, h / 14, 30); const px = cell / 10;
  // en 3D : perspective cavalière, du bas vers le haut
  const sk = 0.55; const larg = 10 * cell + 2.6 * cell * sk;
  const ox = Math.max(8, (w - larg) / 2 - cell * 0.6); const ecart = h * 0.27; const base = h * 0.84;
  const p3 = (e, r, c) => [ox + c * cell + r * cell * sk, base - e * ecart - (2 - r) * cell * 0.62];
  // en 2D : une seule grille Orca, à plat, vue de dessus
  const fx = (w - 10 * cell) / 2; const fy = (h - 11 * cell) / 2 + cell * 0.4;
  const p2 = (e, r, c) => [fx + c * cell, fy + ((2 - e) * 4 + r) * cell];
  const pos = (e, r, c) => { const a = p2(e, r, c); const b = p3(e, r, c); return [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m]; };

  texte(ctx, m < 0.5 ? 'ORCA//GLYPH · 2D' : 'ORCA//GLYPH · 3D', 12, 20, m < 0.5 ? GRIS : css, 12, 'left', '600 ');
  for (let e = 0; e < 3; e++) {
    const g = etat.etages[e];
    // la dalle de l'étage (en 2D : un simple bloc de la grille)
    const q = [pos(e, -0.5, -0.5), pos(e, -0.5, 10), pos(e, 2.6, 10), pos(e, 2.6, -0.5)];
    const dy = cell * m;
    ctx.strokeStyle = m > 0.5 && actif === 1 ? css : SOMBRE; ctx.globalAlpha = m > 0.5 && actif === 1 ? 0.8 : 1;
    ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy))); ctx.closePath(); ctx.stroke();
    ctx.globalAlpha = 1;
    for (let r = 0; r < g.length; r++) for (let c = 0; c < g[r].length; c++) {
      const ch = g[r][c]; const [x, y] = pos(e, r, c);
      if (ch === '.') { ctx.fillStyle = '#2a2927'; ctx.fillRect(x + cell / 2 - 0.7, y + cell / 2 - 0.7, 1.4, 1.4); continue; }
      const chaud = etat.chaud[e + ',' + r + ',' + c] || 0;
      const col = chaud > 0 ? ENCRE : /[A-Z]/.test(ch) ? ENCRE : ch === ':' || ch === '*' ? OR : GRIS;
      // le relief : chaque glyphe monte d'autant plus que sa valeur compte
      const val = ch === '*' ? 1.6 : /[0-9a-z]/.test(ch) ? 0.25 + (parseInt(ch, 36) % 10) / 9 : 0.7;
      const haut = ext * val * cell * 1.3;
      for (let k = 2; k < haut; k += 2) bits(ctx, TOUS[ch], x + px, y + px - k, px * 0.95, chaud > 0 ? '#6b5a3a' : '#2f2e2b');
      const sens = actif === 0 && m < 0.5 ? L.sens[ch] : null;
      bits(ctx, TOUS[ch], x + px, y + px - haut, px * 0.95, sens ? css : col);
      // le sens du glyphe : un opérateur est aussi une image
      if (sens) { viseur(ctx, x - 2, y - 2, cell + 4, cell + 4, css, 0.9); texte(ctx, ch + ' · ' + sens, x + cell / 2, y - 6, css, 11, 'center', 'italic '); }
    }
    texte(ctx, `${L.etage} ${e}`, w - 10, base - e * ecart + cell * 0.2, m > 0.5 ? (e === 2 ? css : GRIS) : 'rgba(0,0,0,0)', 11, 'right');
  }
  // les bangs voyagent d'un étage à l'autre : une impulsion qui monte
  if (m > 0.6) for (const l of etat.liens) {
    const [xa, ya] = pos(l.e, 1, l.c); const [xb, yb] = pos(l.e + 1, 1, l.c);
    const a0 = [xa + cell / 2, ya + cell]; const b0 = [xb + cell / 2, yb + cell];
    const k = 1 - l.vie; const fort = actif === 3;
    ctx.strokeStyle = css; ctx.globalAlpha = 0.35 * l.vie; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(b0[0], b0[1]); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = Math.min(1, l.vie * 2); ctx.fillStyle = OR;
    const x = a0[0] + (b0[0] - a0[0]) * k; const y = a0[1] + (b0[1] - a0[1]) * k;
    ctx.beginPath(); ctx.arc(x, y, fort ? 4 : 2.5, 0, Math.PI * 2); ctx.fill();
    if (fort) { ctx.strokeStyle = OR; ctx.globalAlpha = 0.5 * l.vie; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  return { info: L.orca, actif };
}

// ---------------------------------------------------------------- CAVE // FOUR ROBOTS : quatre robots autour du public, leurs sons dans la grotte
function cave (ctx, w, h, t, etat, css, L) {
  const cx = w / 2; const cy = h * 0.47; const R = Math.min(w / 1.12, h) * 0.42;
  if (!etat.init) {
    etat.init = true;
    etat.bord = Array.from({ length: 48 }, (_, i) => { const a = i / 48 * Math.PI * 2; return 1 + 0.12 * Math.sin(a * 3 + 1) + 0.07 * Math.sin(a * 7 + 2) + 0.04 * Math.sin(a * 13); });
    etat.public = Array.from({ length: 26 }, (_, i) => [Math.cos(i * 2.4) * (4 + (i % 5) * 3.2), Math.sin(i * 2.4) * (4 + (i % 5) * 3.2)]);
    etat.ondes = []; etat.dernier = [0, 0, 0, 0];
  }
  // un cycle de 20 s : le public, les robots, puis ensemble, puis chacun son tempo
  const ph = t % 20;
  const actif = ph < 3 ? 0 : ph < 6 ? 1 : ph < 13 ? 2 : 3;
  const sync = actif !== 3;
  const ech = R / 120;
  // la grotte
  ctx.strokeStyle = SOMBRE; ctx.lineWidth = 1.5; ctx.beginPath();
  etat.bord.forEach((k, i) => { const a = i / 48 * Math.PI * 2; const x = cx + Math.cos(a) * R * k * 1.12; const y = cy + Math.sin(a) * R * k; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
  ctx.closePath(); ctx.stroke(); ctx.lineWidth = 1;
  // les ondes, que la roche renvoie
  etat.ondes = etat.ondes.filter((o) => (o.r += etat.dt * R * 0.55) < R * 1.3);
  for (const o of etat.ondes) { ctx.strokeStyle = css; ctx.globalAlpha = Math.max(0, 0.55 * (1 - o.r / (R * 1.3))); ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.stroke(); }
  ctx.globalAlpha = 1;
  // le public au centre
  ctx.fillStyle = actif === 0 ? ENCRE : GRIS; for (const [x, y] of etat.public) ctx.fillRect(cx + x * ech * 1.4 - 1.5, cy + y * ech * 1.4 - 1.5, 3, 3);
  texte(ctx, L.public, cx, cy + 34 * ech + 14, actif === 0 ? css : GRIS, 11, 'center');
  if (actif === 0) { const r = 22 * ech + 10; viseur(ctx, cx - r, cy - r, r * 2, r * 2, css); }
  // les quatre robots, chacun avec son mégaphone tourné vers le public
  for (let i = 0; i < 4; i++) {
    const vit = sync ? 0.32 : [0.21, 0.37, 0.29, 0.45][i];
    const a = t * vit + i * Math.PI / 2;
    const rr = R * (0.62 + (sync ? 0.06 : 0.12 * Math.sin(t * 0.8 + i)));
    const x = cx + Math.cos(a) * rr * 1.1; const y = cy + Math.sin(a) * rr;
    const per = sync ? 1.6 : [1.1, 1.9, 1.4, 2.3][i];
    if (actif >= 2 && t - etat.dernier[i] > per) { etat.dernier[i] = sync ? Math.floor(t / per) * per : t; etat.ondes.push({ x, y, r: 4 }); }
    const vers = Math.atan2(cy - y, cx - x);
    const s = Math.max(1, ech * 1.3);
    ctx.save(); ctx.translate(x, y); ctx.rotate(vers); ctx.scale(s, s);
    ctx.fillStyle = ENCRE; ctx.fillRect(-5, -3.5, 10, 7);
    ctx.fillStyle = css; ctx.beginPath(); ctx.moveTo(5, -2); ctx.lineTo(11, -5); ctx.lineTo(11, 5); ctx.lineTo(5, 2); ctx.closePath(); ctx.fill();
    ctx.restore();
    texte(ctx, 'robot 0' + (i + 1), x, y - 12 * s, actif === 1 ? css : GRIS, 10, 'center');
    if (actif === 1) viseur(ctx, x - 14 * s, y - 10 * s, 28 * s, 20 * s, css, 0.8);
  }
  texte(ctx, sync ? L.sync : L.desync, 12, h - 12, actif >= 2 ? css : GRIS, 12);
  return { info: L.cave, actif };
}

// ---------------------------------------------------------------- Langue des images : un concept se compose de trois images
function langue (ctx, w, h, t, etat, css, L) {
  const DUREE = 6;
  const n = Math.floor(Math.max(0, t) / DUREE) % L.compos.length; const u = (t % DUREE) / DUREE;
  const [mot, images] = L.compos[n];
  const px = Math.max(3, Math.floor(Math.min(w / 34, h / 30)));
  const taille = px * 8; const gap = taille * 0.45;
  const total = taille * 3 + gap * 2; const x0 = (w - total) / 2; const y0 = h * 0.2;
  images.forEach(([signe, nom], i) => {
    const debut = 0.1 + i * 0.12; const part = Math.min(1, Math.max(0, (u - debut) / 0.12));
    const x = x0 + i * (taille + gap);
    if (part <= 0) { ctx.strokeStyle = SOMBRE; ctx.strokeRect(x - 0.5, y0 - 0.5, taille + 1, taille + 1); }
    bits(ctx, SIG[signe], x, y0, px, part >= 1 ? ENCRE : css, part, i + n * 3);
    if (part > 0.3) texte(ctx, nom, x + taille / 2, y0 + taille + 20, GRIS, 12, 'center');
    if (u > 0.22 && u < 0.46 && part > 0) { viseur(ctx, x - 6, y0 - 6, taille + 12, taille + 12, css, 0.8); texte(ctx, '8 × 8', x + taille / 2, y0 - 12, css, 10, 'center'); }
    if (i < 2 && part >= 1) texte(ctx, '·', x + taille + gap / 2, y0 + taille / 2 + 5, GRIS, 18, 'center');
  });
  if (u > 0.62) {
    const a = Math.min(1, (u - 0.62) / 0.12);
    ctx.globalAlpha = a;
    texte(ctx, '=', w / 2, y0 + taille + 56, GRIS, 18, 'center');
    texte(ctx, mot.toUpperCase(), w / 2, y0 + taille + 92, css, 22, 'center', '600 ');
    ctx.globalAlpha = 1;
  }
  texte(ctx, `${n + 1} / ${L.compos.length}`, w - 12, h - 12, GRIS, 11, 'right');
  const actif = u < 0.1 ? 0 : u < 0.46 ? 1 : u < 0.62 ? 2 : 3;
  return { info: L.langue, actif };
}

// ---------------------------------------------------------------- TEAMMATE.POTO : une créature qui écoute, digère et répond
function teammate (ctx, w, h, t, etat, css, L) {
  const CYCLE = 12;
  const k = Math.floor(t / CYCLE); const u = (t % CYCLE) / CYCLE;
  if (etat.k !== k) {
    etat.k = k;
    let s = k * 9301 + 49297; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    // un cycle sur deux, la phrase est monotone : la cellule stresse
    etat.monotone = k % 2 === 1;
    const v0 = 0.3 + rnd() * 0.5;
    etat.phrase = Array.from({ length: 12 }, (_, i) => etat.monotone ? v0 + (i % 2) * 0.08 : 0.2 + rnd() * 0.8);
    etat.decision = k % L.decisions.length;
    etat.voies = Array.from({ length: 7 }, () => rnd());
    etat.lv = 3 + k;
  }
  const actif = u < 0.14 ? 0 : u < 0.42 ? 1 : u < 0.66 ? 2 : 3;
  const pad = 12; const larg = w - pad * 2;
  const stress = etat.monotone ? Math.min(1, Math.max(0, (u - 0.42) / 0.2)) * 0.85 + 0.1 : 0.15;

  // la créature : un visage, une humeur, un niveau
  const fh = h * 0.17; const fw = Math.min(larg * 0.55, 260);
  ctx.strokeStyle = actif === 0 ? css : SOMBRE; ctx.strokeRect(pad + 0.5, 8.5, fw, fh);
  const visage = actif === 3 && etat.decision === 4 ? '( -_- ) zzz' : stress > 0.6 ? '( >_< )' : actif === 3 ? '( ^o^ )' : actif === 1 ? '( o_o )' : '( ^_^ )';
  texte(ctx, visage, pad + fw / 2, 8 + fh * 0.5, ENCRE, Math.min(22, fh * 0.32), 'center', '600 ');
  const dit = actif === 0 ? L.parole[0] : actif === 1 ? L.parole[1] : actif === 2 ? (stress > 0.6 ? L.parole[2] : L.parole[3]) : L.parole[4];
  texte(ctx, '« ' + dit + ' »', pad + fw / 2, 8 + fh * 0.84, css, 11, 'center', 'italic ');
  const ix = pad + fw + 16;
  if (ix + 60 < w) {
    texte(ctx, 'Lv ' + (etat.lv + (actif === 3 && u > 0.85 ? 1 : 0)), ix, 26, actif === 0 || (actif === 3 && u > 0.85) ? css : ENCRE, 13, 'left', '600 ');
    const xp = actif === 3 ? Math.min(1, (u - 0.66) / 0.2) : 0.35;
    ctx.fillStyle = SOMBRE; ctx.fillRect(ix, 34, w - ix - pad, 4); ctx.fillStyle = css; ctx.fillRect(ix, 34, (w - ix - pad) * xp, 4);
    texte(ctx, 'XP', ix, 52, GRIS, 10);
    texte(ctx, L.humeur + ' : ' + (stress > 0.6 ? L.humeurs[1] : actif === 3 ? L.humeurs[2] : L.humeurs[0]), ix, 70, GRIS, 10);
  }

  // toi : la phrase jouée, puis rangée en 48 fragments
  const y1 = 8 + fh + 26; const hb = h * 0.07;
  texte(ctx, L.toi, pad, y1 - 6, actif === 1 ? css : GRIS, 11);
  const vus = Math.min(12, Math.floor(Math.max(0, u - 0.14) / 0.14 * 12));
  const bw = larg / 12;
  for (let i = 0; i < vus; i++) { const hh = etat.phrase[i] * hb; ctx.fillStyle = ENCRE; ctx.fillRect(pad + i * bw + 1, y1 + hb - hh, bw - 3, hh); }
  const my = y1 + hb + 22; const cw = larg / 12; const chh = Math.max(4, h * 0.022);
  texte(ctx, L.memoire, pad, my - 6, actif === 1 ? css : GRIS, 10);
  if (actif === 1) texte(ctx, L.traits.join(' · '), w - pad, my - 6, GRIS, 10, 'right');
  for (let i = 0; i < 48; i++) {
    const c = i % 12; const r = Math.floor(i / 12);
    const plein = u > 0.28 && i < Math.floor(Math.min(1, (u - 0.28) / 0.14) * 48);
    ctx.fillStyle = plein ? css : SOMBRE; ctx.globalAlpha = plein ? 0.3 + etat.phrase[i % 12] * 0.7 : 1;
    ctx.fillRect(pad + c * cw + 1, my + r * (chh + 2), cw - 3, chh);
  }
  ctx.globalAlpha = 1;

  // METABO : l'avatar métabolique, une cellule que le son nourrit
  const cy = my + 4 * (chh + 2) + h * 0.13; const R = Math.min(h * 0.085, larg * 0.14);
  const cx = pad + R + 26;
  const souffle = 1 + Math.sin(t * (1.5 + stress * 6)) * (0.05 + stress * 0.08);
  ctx.strokeStyle = actif === 2 ? css : GRIS; ctx.globalAlpha = actif === 2 ? 1 : 0.6;
  ctx.beginPath(); ctx.arc(cx, cy, R * souffle, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
  texte(ctx, 'METABO', cx, cy + 4, actif === 2 ? css : GRIS, 10, 'center', '600 ');
  L.voies.forEach((nom, i) => {
    const a = -Math.PI / 2 + i / 7 * Math.PI * 2;
    const v = 0.3 + 0.7 * Math.abs(Math.sin(t * (0.6 + i * 0.13 + stress) + etat.voies[i] * 6));
    const x = cx + Math.cos(a) * R * 1.45; const y = cy + Math.sin(a) * R * 1.45;
    ctx.fillStyle = css; ctx.globalAlpha = actif >= 2 ? v : 0.25; ctx.beginPath(); ctx.arc(x, y, 2 + v * 2.5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  });
  const sx = cx + R * 1.45 + 30;
  if (sx + 80 < w) {
    texte(ctx, L.metabo, sx, cy - R + 4, actif === 2 ? ENCRE : GRIS, 11);
    texte(ctx, 'stress', sx, cy + 2, GRIS, 10);
    ctx.fillStyle = SOMBRE; ctx.fillRect(sx + 52, cy - 6, w - sx - 52 - pad, 6);
    ctx.fillStyle = stress > 0.6 ? OR : css; ctx.fillRect(sx + 52, cy - 6, (w - sx - 52 - pad) * stress, 6);
    texte(ctx, stress > 0.6 ? L.etats[1] : L.etats[0], sx, cy + 22, stress > 0.6 ? OR : css, 11);
    texte(ctx, L.voiesNotes, sx, cy + 40, GRIS, 10);
  }

  // la réponse : une décision, puis tes fragments rejoués
  const ry = cy + R * 1.45 + 34;
  if (u > 0.62) {
    let x = pad;
    ctx.font = "11px 'IBM Plex Mono', monospace";
    L.decisions.forEach((d, i) => { const lw = ctx.measureText(d).width; if (x + lw > w - pad) return; const on = i === etat.decision; texte(ctx, d, x, ry, on ? css : '#55534e', 11); if (on) viseur(ctx, x - 4, ry - 13, lw + 8, 18, css); x += lw + 16; });
  }
  if (u > 0.68) {
    const d = etat.decision; const ph = etat.phrase;
    const rep = d === 0 ? ph : d === 1 ? ph.map((v) => 1.2 - v) : d === 2 ? ph.flatMap((v) => [v, v * 0.7]) : d === 3 ? ph.filter((_, i) => i % 3 === 0) : [];
    const vis = Math.floor(Math.min(1, (u - 0.68) / 0.25) * rep.length);
    const bw2 = larg / Math.max(12, rep.length); const hr = Math.min(hb, h - ry - 16);
    for (let i = 0; i < vis; i++) { const hh = Math.max(0.1, rep[i]) * hr; ctx.fillStyle = css; ctx.fillRect(pad + i * bw2 + 1, ry + 10 + hr - hh, bw2 - 3, hh); }
  }
  return { info: L.teammate, actif };
}

// ---------------------------------------------------------------- le panneau « comment ça marche »
function panneau (ctx, x, y, w, h, R, css, L, compact) {
  const COUL = { encre: ENCRE, gris: GRIS, or: OR, css, sombre: '#55534e' };
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = SOMBRE; ctx.beginPath(); if (compact) { ctx.moveTo(x, y + 0.5); ctx.lineTo(x + w, y + 0.5); } else { ctx.moveTo(x + 0.5, y); ctx.lineTo(x + 0.5, y + h); } ctx.stroke();
  const p = compact ? 12 : 16;
  const etapes = R.info.etapes; const n = etapes.length;
  let yy = y + p + 8;
  if (compact) {
    // étroit : seulement l'étape en cours, en grand, et des repères pour les autres
    texte(ctx, L.panneau.toUpperCase(), x + p, yy, GRIS, 10);
    for (let i = 0; i < n; i++) { ctx.fillStyle = i === R.actif ? css : SOMBRE; ctx.fillRect(x + w - p - (n - i) * 16, yy - 7, 12, 3); }
    yy += 22;
    texte(ctx, String(R.actif + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'), x + p, yy, css, 11);
    yy += 20;
    ctx.font = "13px 'IBM Plex Mono', monospace";
    couper(ctx, etapes[R.actif], w - p * 2).forEach((l) => { texte(ctx, l, x + p, yy, ENCRE, 13); yy += 19; });
  } else {
    texte(ctx, L.panneau.toUpperCase(), x + p, yy, GRIS, 10); yy += 18;
    const taille = 12; const ligne = 18;
    ctx.font = `${taille}px 'IBM Plex Mono', monospace`;
    etapes.forEach((s, i) => {
      const on = i === R.actif;
      const lignes = couper(ctx, s, w - p * 2 - 28);
      if (on) { ctx.fillStyle = css; ctx.fillRect(x + p - 6, yy - taille, 2, lignes.length * ligne); }
      texte(ctx, String(i + 1).padStart(2, '0'), x + p, yy, on ? css : '#55534e', taille);
      lignes.forEach((l, j) => texte(ctx, l, x + p + 28, yy + j * ligne, on ? ENCRE : '#6f6c66', taille));
      yy += lignes.length * ligne + 10;
    });
  }
  // la légende des couleurs, en bas du panneau
  const leg = R.info.legende;
  let ly = y + h - p - Math.ceil(leg.length / 2) * 16 + 6;
  if (ly < yy + 10) return;
  texte(ctx, L.legende.toUpperCase(), x + p, ly - 10, GRIS, 10);
  ly += 6;
  leg.forEach(([c, nom], i) => {
    const col = i % 2; const rang = Math.floor(i / 2);
    const lx = x + p + col * (w - p * 2) / 2; const ly2 = ly + rang * 16;
    ctx.fillStyle = COUL[c]; ctx.fillRect(lx, ly2 - 8, 8, 8);
    texte(ctx, nom, lx + 14, ly2, GRIS, 10);
  });
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
  const dessiner = () => {
    ctx.clearRect(0, 0, w, h); points(ctx, w, h, 14);
    // large : la scène à gauche, le panneau à droite ; étroit : la scène en haut, le panneau dessous
    const large = w >= 560;
    const sw = large ? Math.round(w * 0.6) : w; const sh = large ? h : Math.round(Math.max(h * 0.6, h - 190));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sw, sh); ctx.clip();
    const R = f(ctx, sw, sh, t, etat, css, L);
    ctx.restore();
    if (large) panneau(ctx, sw, 0, w - sw, h, R, css, L, false);
    else panneau(ctx, 0, sh, w, h - sh, R, css, L, true);
  };
  const boucle = (now) => { const dt = Math.max(0, Math.min((now - avant) / 1000, 0.1)); avant = now; t += dt; etat.dt = dt; dessiner(); raf = requestAnimationFrame(boucle); };
  if (reduit) { etat.dt = 0.016; dessiner(); } else raf = requestAnimationFrame(boucle);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}
