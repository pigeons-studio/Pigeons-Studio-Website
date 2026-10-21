'use client';

import { useEffect, useRef } from 'react';
import GLYPHES from './glyphes.json';
import styles from './OrcaFond.module.css';

// Orca en 2D, en arrière-plan des pages : la grille de points, ses croix, et un petit patch qui tourne.
// Les lettres sont dessinées avec les damiers 8 × 8 As-Simt, en gris discrets.
const PATCHS: Record<string, string[]> = {
  bio: ['..#PIGEONS.STUDIO#', '', '..#KOO.DES#..........#JULIEN.THOMAS#', '', '..2C4................4C8', '...0..................0', '..1D4................1D8', '', '...:03C...............:05G'],
  projets: ['..#PROJETS#', '', '..#AS.SIMT#...#GO2#...#INSTALLATIONS#', '', '..4C8....1D4', '...0', '..........:03C'],
  services: ['..#SERVICES#', '', '..#OBJETS.AUDIO#..#CAPTEURS#..#3D#', '', '..2C4....1D2', '...0', '..........:13E'],
  boutique: ['..#BOUTIQUE#', '', '..#ACCESSOIRES#..#GEAR#..#MUSIQUE#', '', '..1D2.8TCDEGAcdg', '', '......:14'],
  logiciels: ['..#LOGICIELS#', '', '..#WEB#...#FIRMWARE#...#PC#', '', '..4C8....1D4', '...0', '..........:02E'],
  contact: ['..#CONTACT#', '', '..#PIGEONS.STUDIO#', '', '..1D8...........8-1', '', '.........:15c'],
};

const TOUS: Record<string, string[]> = { ...(GLYPHES.symboles as Record<string, string[]>), ...(GLYPHES.operateurs as Record<string, string[]>) };
const COUL = { com: '#5f5d58', op: '#d8d6cf', val: '#8f8c85', out: '#ffb545' } as const;
const b36 = (ch: string) => { const n = parseInt(ch, 36); return isNaN(n) ? 0 : n; };

function nature (row: string[], c: number) {
  let dans = false;
  for (let i = 0; i < c; i++) if (row[i] === '#') dans = !dans;
  const ch = row[c];
  if (ch === '#' || dans) return 'com';
  if (ch === ':' || ch === '*' || ch === '-') return 'out';
  if (/[A-Z]/.test(ch)) return 'op';
  return 'val';
}

export default function OrcaFond({ patch }: { patch: keyof typeof PATCHS }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CELL = 18; // une case d'Orca, en pixels CSS
    let cols = 0; let rows = 0; let dpr = 1;
    let grille: string[][] = [];
    const chaleur = new Map<string, number>();
    let tic = 0;

    const construire = () => {
      dpr = Math.min(devicePixelRatio, 2);
      const w = canvas.clientWidth; const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / CELL); rows = Math.ceil(h / CELL);
      // le patch se pose en bas à droite de l'écran, loin des titres
      const lignes = PATCHS[patch] || PATCHS.contact;
      const large = Math.max(...lignes.map((l) => l.length));
      const c0 = Math.max(1, cols - large - 3); const r0 = Math.max(4, rows - lignes.length - 5);
      grille = Array.from({ length: rows }, () => Array.from({ length: cols }, () => '.'));
      lignes.forEach((l, r) => [...l].forEach((ch, c) => { if (grille[r0 + r] && c0 + c < cols) grille[r0 + r][c0 + c] = ch; }));
    };
    const ecrire = (c: number, r: number, ch: string) => { if (grille[r] && c < cols) grille[r][c] = ch; };
    const chauffer = (c: number, r: number) => chaleur.set(c + ',' + r, 1);

    const avancer = () => {
      tic++;
      const bangs: [number, number][] = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const row = grille[r]; const ch = row[c];
        if (!/[A-Z]/.test(ch) || nature(row, c) !== 'op') continue;
        const gauche = c > 0 ? row[c - 1] : '.'; const loin = c > 1 ? row[c - 2] : '.';
        if (ch === 'C') { const vit = Math.max(1, b36(loin)); const mod = b36(row[c + 1] || '.') || 10; ecrire(c, r + 1, (Math.floor(tic / vit) % mod).toString(36)); }
        if (ch === 'D') { const vit = Math.max(1, b36(gauche)); const mod = b36(row[c + 1] || '.') || 8; const on = tic % (vit * mod) === 0; ecrire(c, r + 1, on ? '*' : '.'); if (on) { chauffer(c, r); bangs.push([c, r + 1]); } }
        if (ch === 'T') { const len = Math.max(1, b36(gauche)); const k = tic % len; ecrire(c, r + 1, row[c + 1 + k] || '.'); chauffer(c + 1 + k, r); }
      }
      for (const [c, r] of bangs) {
        for (let rr = r; rr < Math.min(rows, r + 4); rr++) for (let dc = -2; dc < 16; dc++) { const ch = grille[rr]?.[c + dc]; if (ch === ':' || ch === '-') { chauffer(c + dc, rr); rr = rows; break; } }
      }
    };

    const dessiner = () => {
      const w = canvas.width; const h = canvas.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const px = CELL / 10;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const ch = grille[r][c]; const x = c * CELL; const y = r * CELL;
        if (ch === '.') {
          // un point par case, une croix tous les 8, comme dans Orca
          if (c % 8 === 0 && r % 8 === 0) { ctx.fillStyle = '#3a3936'; ctx.fillRect(x + CELL / 2 - 3, y + CELL / 2 - 0.5, 6, 1); ctx.fillRect(x + CELL / 2 - 0.5, y + CELL / 2 - 3, 1, 6); }
          else { ctx.fillStyle = '#242321'; ctx.fillRect(x + CELL / 2 - 0.75, y + CELL / 2 - 0.75, 1.5, 1.5); }
          continue;
        }
        const bits = TOUS[ch]; if (!bits) continue;
        const k = chaleur.get(c + ',' + r) || 0;
        ctx.fillStyle = k > 0.05 ? '#ffffff' : COUL[nature(grille[r], c)];
        ctx.globalAlpha = 0.55 + 0.45 * k;
        for (let yy = 0; yy < 8; yy++) for (let xx = 0; xx < 8; xx++) if (bits[yy][xx] === '#') ctx.fillRect(x + px + xx * px, y + px + yy * px, px, px);
        ctx.globalAlpha = 1;
      }
    };

    construire(); dessiner();
    const ro = new ResizeObserver(() => { construire(); dessiner(); }); ro.observe(canvas);
    let raf = 0; let avant = performance.now(); let acc = 0;
    const PAS = 60 / 120 / 4;
    const boucle = (t: number) => {
      const dt = Math.min((t - avant) / 1000, 0.1); avant = t; acc += dt;
      let change = false;
      while (acc > PAS) { acc -= PAS; avancer(); change = true; }
      for (const [k, v] of chaleur) { const n = v - dt * 3; if (n <= 0) chaleur.delete(k); else chaleur.set(k, n); change = true; }
      if (change) dessiner();
      raf = requestAnimationFrame(boucle);
    };
    if (!reduit) raf = requestAnimationFrame(boucle);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [patch]);

  return (
    <div className={styles.fond} aria-hidden="true">
      <canvas ref={ref} className={styles.canvas} />
    </div>
  );
}
