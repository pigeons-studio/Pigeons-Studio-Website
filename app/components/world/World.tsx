'use client';

// Le site Pigeons Studio : le viseur ORCA//GLYPH, repris fidèlement de la page Claude.
// En 3D, six étages et leurs glyphes-menus ; la molette traverse les étages ; un clic descend en page 2D.
// En plus de la page Claude : le français et l'anglais, un vrai panier et la vraie connexion du site.
import { Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { signIn, signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useCartStore } from '@/app/store/cartStore';
import GLYPHES from './glyphes.json';
import CONTENU from './contenu.json';
import OPS from './operateurs.json';
import type { World as Monde, Etage } from './engine';
import EventsPanel from './Events';
import Scene from './Scene';
import './orca.css';

type Locale = 'fr' | 'en';
type Mode = '3d' | 'vers2d' | '2d' | 'vers3d';
type Prix = 'coming' | 'quote' | 'soon';
type Item = { nom: string; sens: string; tags?: string[]; prix?: Prix; panier?: number; src?: string; duree?: string; image?: string; alt?: string; couleurs?: [string, string][]; glyphes?: [string, string][]; glyphesSens?: string; collab?: { texte: string; nom: string; lien: string }; details?: [string, string][]; tarif?: string; commande?: string };
type Projet = { id: string; nom: string; sous: string; statut: string; texte: string[]; reperes: string[][]; tags: string[]; objet?: string; video?: string; film?: string; liens?: [string, string][] };
type Bloc = { t: string; p?: string; titre?: string; sur?: string; duo?: string; legende?: string; signe?: string; code?: string; vide?: string; items?: unknown[]; fiches?: unknown[] };
type Famille = { id: string; nom: string; code: string; signe: string; pourquoi: string; teinte: number; css: string; blocs: Bloc[] };

const EMAIL = 'contact@punkhazard.org';

// les petits patchs Orca de chaque étage ; les commentaires suivent la langue
const PATCHS: Record<Locale, Record<string, string[]>> = {
  fr: {
    bio: ['', '..#PIGEONS.STUDIO#', '', '..#KOO.DES#..........#JULIEN.THOMAS#', '', '..2C4................4C8', '...0..................0', '..1D4................1D8', '', '...:03C...............:05G'],
    projets: ['', '..#PROJETS#', '', '..#AS.SIMT#...#GO2#...#INSTALLATIONS#', '', '..4C8....1D4', '...0', '..........:03C'],
    services: ['', '..#SERVICES#', '', '..#OBJETS.AUDIO#..#CAPTEURS#..#3D#', '', '..2C4....1D2', '...0', '..........:13E'],
    events: ['', '..#EVENTS#', '', '..#WORKSHOP#..#PERFORMANCE#', '', '..1D8...........8-1', '', '.........:15c'],
    boutique: ['', '..#BOUTIQUE#', '', '..#ACCESSOIRES#..#GEAR#..#MUSIQUE#', '', '..1D2.8TCDEGAcdg', '', '......:14'],
    logiciels: ['', '..#LOGICIELS#', '', '..#WEB#...#FIRMWARE#...#PC#', '', '..4C8....1D4', '...0', '..........:02E'],
  },
  en: {
    bio: ['', '..#PIGEONS.STUDIO#', '', '..#KOO.DES#..........#JULIEN.THOMAS#', '', '..2C4................4C8', '...0..................0', '..1D4................1D8', '', '...:03C...............:05G'],
    projets: ['', '..#PROJECTS#', '', '..#AS.SIMT#...#GO2#...#INSTALLATIONS#', '', '..4C8....1D4', '...0', '..........:03C'],
    services: ['', '..#SERVICES#', '', '..#AUDIO.OBJECTS#..#SENSORS#..#3D#', '', '..2C4....1D2', '...0', '..........:13E'],
    events: ['', '..#EVENTS#', '', '..#WORKSHOP#..#PERFORMANCE#', '', '..1D8...........8-1', '', '.........:15c'],
    boutique: ['', '..#SHOP#', '', '..#ACCESSORIES#..#GEAR#..#MUSIC#', '', '..1D2.8TCDEGAcdg', '', '......:14'],
    logiciels: ['', '..#SOFTWARE#', '', '..#WEB#...#FIRMWARE#...#PC#', '', '..4C8....1D4', '...0', '..........:02E'],
  },
};

// les signes de l'alphabet partagé, et leur mot
const MOTS: Record<Locale, Record<string, string>> = {
  fr: { E113: 'double', E132: 'faire', E140: 'donner', E0EE: 'graine', E083: 'paume', E130: 'signal', E082: 'peau', E119: 'machine', E11C: 'vibration', E167: 'petit', E16C: 'doux', E0CA: 'montagne', E0E8: 'cercle' },
  en: { E113: 'double', E132: 'make', E140: 'give', E0EE: 'seed', E083: 'palm', E130: 'signal', E082: 'skin', E119: 'machine', E11C: 'vibration', E167: 'small', E16C: 'soft', E0CA: 'mountain', E0E8: 'circle' },
};

const UI = {
  fr: {
    connexion: 'connexion', compte: 'compte', contact: 'contact', panier: 'panier', retour: '◂ 3D', etage: 'étage', etages: (n: number) => `${n} étages`,
    aide: 'molette : traverser les étages · clic : entrer', entrer: (n: number) => `étage ${n} · cliquer pour entrer`, aideTactile: 'glisser ↕ · toucher', toucher: (n: number) => `étage ${n} · toucher encore pour entrer`,
    ici: 'tu es ici', aller: (n: number) => `aller à l'étage ${n}`, rubriques: 'rubriques',
    prix: { coming: 'À venir', quote: 'Sur devis', soon: 'Bientôt disponible' } as Record<Prix, string>,
    prevenir: 'être prévenu', devis: 'demander un devis', ajouter: 'ajouter au panier', ajoute: 'ajouté',
    contactTitre: 'CONTACT', contactTexte: 'Marques, institutions, robotique et IA : parlons de votre projet.', aPropos: 'à propos de : ',
    copier: 'copier', copie: 'copié', reponse: 'Réponse généralement sous 24-48h.', fermer: 'fermer', legal: 'mentions légales', cgv: 'CGV',
    panierTitre: 'PANIER', vide: 'Vide pour l’instant.', vider: 'vider', commander: 'passer la commande',
    commandeBientot: 'Le paiement en ligne arrive bientôt. Pour commander, écrivez au studio :',
    profil: 'mon profil', bonjour: 'connecté·e', deconnexion: 'déconnexion',
    droits: '© 2026 Pigeons Studio - Tous droits réservés.', cgvLong: 'conditions générales de vente', ouEcrire: 'ou écrire directement :',
  },
  en: {
    connexion: 'login', compte: 'account', contact: 'contact', panier: 'cart', retour: '◂ 3D', etage: 'floor', etages: (n: number) => `${n} floors`,
    aide: 'scroll: move through the floors · click: enter', entrer: (n: number) => `floor ${n} · click to enter`, aideTactile: 'swipe ↕ · tap', toucher: (n: number) => `floor ${n} · tap again to enter`,
    ici: 'you are here', aller: (n: number) => `go to floor ${n}`, rubriques: 'sections',
    prix: { coming: 'Coming soon', quote: 'On quote', soon: 'Coming soon' } as Record<Prix, string>,
    prevenir: 'get notified', devis: 'request a quote', ajouter: 'add to cart', ajoute: 'added',
    contactTitre: 'CONTACT', contactTexte: 'Brands, institutions, robotics and AI: let’s talk about your project.', aPropos: 'about: ',
    copier: 'copy', copie: 'copied', reponse: 'We usually reply within 24-48h.', fermer: 'close', legal: 'legal notice', cgv: 'terms',
    panierTitre: 'CART', vide: 'Empty for now.', vider: 'empty', commander: 'checkout',
    commandeBientot: 'Online payment is coming soon. To order, write to the studio:',
    profil: 'my profile', bonjour: 'signed in', deconnexion: 'log out',
    droits: '© 2026 Pigeons Studio - All rights reserved.', cgvLong: 'terms of sale', ouEcrire: 'or write directly:',
  },
};
type Ui = (typeof UI)['fr'];

function Glyphe({ signe, couleur }: { signe: string; couleur: string }) {
  const rows = (GLYPHES.signes as Record<string, string[]>)[signe] || [];
  return (
    <svg viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, r) => [...row].map((c, q) => (c === '#' ? <rect key={`${r}-${q}`} x={q} y={r} width={1} height={1} fill={couleur} /> : null)))}
    </svg>
  );
}

type Tiroir = { quoi: 'contact'; sujet: string } | { quoi: 'panier' } | { quoi: 'connexion'; inscription: boolean } | null;

export default function World() {
  const locale: Locale = useLocale() === 'en' ? 'en' : 'fr';
  const pathname = usePathname();
  const router = useRouter();
  const menu = pathname.split('/').filter(Boolean);
  const ui = UI[locale];
  const FAMILLES = CONTENU[locale] as Famille[];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trkRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const mondeRef = useRef<Monde | null>(null);
  const [mode, setMode] = useState<Mode>('3d');
  const [etage, setEtage] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tiroir, setTiroir] = useState<Tiroir>(null);
  const [survolHtml, setSurvolHtml] = useState<{ i: number; box: DOMRect } | null>(null);
  const [monte, setMonte] = useState(false);
  const [pret, setPret] = useState(false);
  const totalPanier = useCartStore((s) => s.getTotalItems());
  const { data: session } = useSession();
  const menuKey = menu.join('/');
  const menuRef = useRef(menuKey);
  const modeRef = useRef<Mode>('3d');
  const skipRef = useRef<string | null>(null);
  const premierRef = useRef(true);
  menuRef.current = menuKey;

  const pousser = (floor: string | null, fiche?: string) => {
    const key = !floor ? '' : fiche ? `${floor}/${fiche}` : floor;
    if (key === menuRef.current) return;
    skipRef.current = key;
    router.push(!floor ? '/' : fiche ? `/${floor}/${fiche}` : `/${floor}`, { scroll: false });
  };
  const pousserRef = useRef(pousser);
  pousserRef.current = pousser;

  useEffect(() => { setMonte(true); }, []);

  // ---------------------------------------------------------------- le monde 3D (même moteur que la page Claude)
  useEffect(() => {
    if (!canvasRef.current || !trkRef.current) return;
    let monde: Monde | null = null;
    let annule = false;
    import('./engine').then(({ createWorld }) => {
      if (annule || !canvasRef.current || !trkRef.current) return;
      const etages: Etage[] = FAMILLES.map((g) => ({ id: g.id, signe: g.signe, teinte: g.teinte, css: g.css, nom: g.nom, mot: MOTS[locale][g.signe] }));
      monde = createWorld({
        canvas: canvasRef.current,
        tracker: trkRef.current,
        etages,
        patchs: PATCHS[locale],
        textes: { entrer: ui.entrer, toucher: ui.toucher },
        onMode: (m, e) => {
          modeRef.current = m;
          setMode(m); setEtage(e);
          const id = FAMILLES[e]?.id;
          const actuel = menuRef.current.split('/')[0];
          const pending = skipRef.current;
          const gardeFiche = Boolean(id && pending && (pending === id || pending.startsWith(`${id}/`)));
          if (m === '2d' || m === 'vers2d') {
            if (m === '2d') {
              setVisible(true);
              pageRef.current?.scrollTo(0, 0);
            } else setVisible(false);
            if (id && actuel !== id && !gardeFiche) pousserRef.current(id);
          } else {
            setVisible(false);
            if (menuRef.current) pousserRef.current(null);
          }
        },
      });
      mondeRef.current = monde;
      if (!annule) {
        premierRef.current = true;
        setPret(true);
        // un ancien lien ?etage=services : on l'ouvre dans le routeur, puis on descend
        const voulu = new URLSearchParams(window.location.search).get('etage');
        const n = voulu ? FAMILLES.findIndex((g) => g.id === voulu) : -1;
        if (n >= 0 && voulu) {
          pousserRef.current(voulu);
          window.setTimeout(() => { if (!annule) monde?.descendre(n, true); }, 400);
        }
      }
    });
    return () => { annule = true; setPret(false); monde?.detruire(); mondeRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // l'URL est la source de vérité au chargement, au retour navigateur et au changement de langue
  useEffect(() => {
    const m = mondeRef.current;
    if (!m || !pret) return;
    if (skipRef.current !== null && skipRef.current === menuKey) {
      skipRef.current = null;
      return;
    }
    const [floor] = menu;
    const direct = premierRef.current;
    premierRef.current = false;
    if (!floor) {
      if (modeRef.current === '2d' || modeRef.current === 'vers2d') m.remonter();
      return;
    }
    const idx = FAMILLES.findIndex((g) => g.id === floor);
    if (idx < 0) return;
    if (modeRef.current === '3d' || modeRef.current === 'vers3d') m.descendre(idx, direct);
    else if (idx !== etage) m.changer(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuKey, pret, locale]);

  // d'une page à l'autre en 2D : la page glisse, la nouvelle apparaît sur la dalle
  // aller à la fiche d'un autre projet : on change d'étage si besoin, puis l'explorateur ouvre la bonne fiche
  const allerProjet = (id: string) => {
    const fam = FAMILLES.findIndex((g) => g.blocs.some((b) => b.t === 'explorer' && (b.items as Projet[]).some((x) => x.id === id)));
    if (fam < 0) return;
    pousser(FAMILLES[fam].id, id);
    if (fam !== etage) changer(fam);
  };
  const changer = (n: number) => {
    if (n === etage) return;
    setSurvolHtml(null);
    setVisible(false);
    window.setTimeout(() => { mondeRef.current?.changer(n); setEtage(n); setVisible(true); pageRef.current?.scrollTo(0, 0); }, 260);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const m = mondeRef.current; if (!m) return;
      if (e.key === 'Escape') { if (tiroir) { setTiroir(null); return; } if (mode === '2d') m.remonter(); }
      if (tiroir) return;
      if (mode === '2d' && (e.key === 'PageUp' || e.key === 'PageDown')) { const n = etage + (e.key === 'PageUp' ? 1 : -1); if (n >= 0 && n < FAMILLES.length) changer(n); e.preventDefault(); }
      if (mode === '3d' && e.key === 'Enter' && m.etageVise() >= 0) m.descendre(m.etageVise());
      if (mode === '3d' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { m.avancer(e.key === 'ArrowDown' ? 1 : -1); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const f = FAMILLES[etage];
  const etatLabel = mode === '3d' ? '3D' : mode === '2d' ? '2D' : mode === 'vers2d' ? '3D → 2D' : '2D → 3D';
  const etatTexte = mode === '3d' || mode === 'vers3d' ? ` · ${ui.etages(FAMILLES.length)}` : ` · ${ui.etage} ${etage} · ${f.nom}`;

  return (
    <div className="orca">
      <canvas id="monde" ref={canvasRef} aria-hidden="true" />
      <div id="cadre">
        <i className="coin a" /><i className="coin b" /><i className="coin c" /><i className="coin d" />
        <div className="c hg">PIGEONS//STUDIO</div>
        <div className="c hd">
          {monte && totalPanier > 0 && (
            <button id="panier-btn" type="button" onClick={() => setTiroir(tiroir?.quoi === 'panier' ? null : { quoi: 'panier' })}>{ui.panier} · {totalPanier}</button>
          )}
          <button id="connexion" type="button" onClick={() => setTiroir(tiroir?.quoi === 'connexion' ? null : { quoi: 'connexion', inscription: false })}>{session ? (session.user?.name?.split(' ')[0] || ui.compte) : ui.connexion}</button>
          <button id="panier" type="button" onClick={() => setTiroir(tiroir?.quoi === 'contact' ? null : { quoi: 'contact', sujet: '' })}>{ui.contact}</button>
          <Langue />
        </div>
        <div className="c bg"><span id="etat"><b>{etatLabel}</b>{etatTexte}</span>{mode === '3d' && <span className="aide">{ui.aide}</span>}{mode === '3d' && <span className="aide-tactile">{ui.aideTactile}</span>}</div>
        <div className="c bd"><button id="retour" type="button" hidden={mode !== '2d'} onClick={() => mondeRef.current?.remonter()}>{ui.retour}</button><span className="legal3d"><span>{ui.droits}</span><Link href="/legal">{ui.legal}</Link><Link href="/terms">{ui.cgv}</Link></span></div>
      </div>
      <div id="trk" ref={trkRef} aria-hidden="true"><i /><i /><i /><i /><span /></div>
      {survolHtml && mode === '2d' && <TrackerHtml g={FAMILLES[survolHtml.i]} box={survolHtml.box} />}

      <main id="page" ref={pageRef} className={visible && mode === '2d' ? 'on' : ''} aria-hidden={mode !== '2d'}>
        <div className="dedans" id="contenu">
          <div className="familles-bloc">
            <nav className="familles" aria-label={ui.rubriques}>
              {FAMILLES.map((g, i) => (
                <button key={g.id} type="button" aria-label={g.nom} aria-current={i === etage}
                  onPointerEnter={(e) => setSurvolHtml({ i, box: e.currentTarget.getBoundingClientRect() })}
                  onPointerLeave={() => setSurvolHtml(null)}
                  onFocus={(e) => setSurvolHtml({ i, box: e.currentTarget.getBoundingClientRect() })}
                  onBlur={() => setSurvolHtml(null)}
                  onClick={() => changer(i)}>
                  <Glyphe signe={g.signe} couleur={i === etage || survolHtml?.i === i ? g.css : '#8a8780'} />
                  <span className="lib" style={{ ['--c' as string]: g.css }} aria-hidden="true"><em>{MOTS[locale][g.signe]}</em><b>{g.nom}</b></span>
                </button>
              ))}
            </nav>
            {/* la traduction se lit sur sa propre ligne, sous les glyphes : elle ne recouvre jamais un autre glyphe */}
            <Traduction g={FAMILLES[survolHtml?.i ?? etage]} n={survolHtml?.i ?? etage} ici={(survolHtml?.i ?? etage) === etage} ui={ui} locale={locale} />
          </div>
          <div className="titre">
            <Glyphe signe={f.signe} couleur={f.css} />
            <div><h1>{f.nom}</h1><p>{MOTS[locale][f.signe]}{f.pourquoi !== MOTS[locale][f.signe] ? ` · ${f.pourquoi}` : ''}</p></div>
          </div>
          {f.blocs.map((b, i) => <BlocVue key={`${f.id}-${i}`} b={b} f={f} ui={ui} locale={locale} ouvrirContact={(sujet) => setTiroir({ quoi: 'contact', sujet })} fiche={menu[0] === f.id ? menu[1] : undefined} onFiche={(id) => pousser(f.id, id)} allerProjet={allerProjet} />)}
        </div>
      </main>

      {tiroir && <div id="voile" onClick={() => setTiroir(null)} aria-hidden="true" />}
      {tiroir && (
        <aside id="tiroir" className={`tiroir-${tiroir.quoi}`} aria-label={tiroir.quoi} role={tiroir.quoi === 'panier' ? undefined : 'dialog'}>
          {tiroir.quoi === 'contact' && <TiroirContact sujet={tiroir.sujet} ui={ui} fermer={() => setTiroir(null)} />}
          {tiroir.quoi === 'panier' && <TiroirPanier ui={ui} locale={locale} fermer={() => setTiroir(null)} />}
          {tiroir.quoi === 'connexion' && <TiroirConnexion inscription={tiroir.inscription} ui={ui} basculer={(v) => setTiroir({ quoi: 'connexion', inscription: v })} fermer={() => setTiroir(null)} />}
        </aside>
      )}
    </div>
  );
}

// le réticule se pose sur le glyphe survolé ; le texte, lui, est écrit sous la rangée (Traduction)
function TrackerHtml({ g, box }: { g: Famille; box: DOMRect }) {
  const m = 5;
  return (
    <div className="trk on" style={{ ['--c' as string]: g.css, transform: `translate(${box.left - m}px,${box.top - m}px)`, width: box.width + 2 * m, height: box.height + 2 * m }} aria-hidden="true">
      <i /><i /><i /><i />
    </div>
  );
}

const PAS_GLYPHE = 48; // un bouton de 40 px et 8 px d'écart
function Traduction({ g, n, ici, ui, locale }: { g: Famille; n: number; ici: boolean; ui: Ui; locale: Locale }) {
  const x = n * PAS_GLYPHE + 20;
  return (
    <div className="familles-trad" style={{ ['--c' as string]: g.css, ['--x' as string]: `${x}px` }} aria-live="polite">
      <i className="trait" />
      <span className="mot">{MOTS[locale][g.signe]}</span>
      <span className="fleche">→</span>
      <span className="nom">{g.nom}</span>
      <em>{ici ? ui.ici : ui.aller(n)}</em>
    </div>
  );
}

// ---------------------------------------------------------------- les blocs d'une page 2D (comme remplir() de la page Claude)
function BlocVue({ b, f, ui, locale, ouvrirContact, fiche, onFiche, allerProjet }: { b: Bloc; f: Famille; ui: Ui; locale: Locale; ouvrirContact: (s: string) => void; fiche?: string; onFiche: (id: string) => void; allerProjet: (id: string) => void }) {
  if (b.t === 'lead') return <div className="lead"><p className="sur">{b.sur}</p><p className="duo">{b.duo}</p><p className="legende">{b.legende}</p></div>;
  if (b.t === 'texte') return <section className="texte">{b.titre && <h2 className="etiquette">{b.titre}</h2>}<p>{b.p}</p></section>;
  if (b.t === 'vide') return <p className="vide">{b.p}</p>;
  if (b.t === 'deux') return <div className="bio">{(b.items as string[][]).map(([n, r, p]) => <section key={n}><h3>{n}</h3><h2>{r}</h2><p>{p}</p></section>)}</div>;
  if (b.t === 'liste') return <section className="liste"><h2 className="etiquette">{b.titre}</h2><dl>{(b.items as string[][]).flatMap(([k, v]) => [<dt key={`t${k}`}>{k}</dt>, <dd key={`d${k}`}>{v}</dd>])}</dl></section>;
  if (b.t === 'devis') return <div className="pied"><button type="button" className="btn" onClick={() => ouvrirContact('')}>{ui.devis}</button></div>;
  // un étage peut mêler les rendez-vous de la base (events) et des fiches écrites ici (explorer) : chaque fiche ouverte ne s'affiche que dans son bloc
  const locales = f.blocs.filter((x) => x.t === 'explorer').flatMap((x) => (x.items as Projet[]).map((i) => i.id));
  const aEvents = f.blocs.some((x) => x.t === 'events');
  if (b.t === 'explorer' && aEvents && fiche && !locales.includes(fiche)) return null;
  if (b.t === 'events' && fiche && locales.includes(fiche)) return null;
  if (b.t === 'explorer') return <Explorer items={b.items as Projet[]} css={f.css} code={f.code} locale={locale} fiche={fiche} onFiche={onFiche} allerProjet={allerProjet} />;
  if (b.t === 'events') return <Suspense fallback={null}><EventsPanel locale={locale} css={f.css} fiche={fiche} onFiche={onFiche} /></Suspense>;
  if (b.t === 'films') {
    return (
      <div className="films">
        {(b.items as Item[]).map((it) => (
          <figure key={it.nom} className="film">
            <video src={`${it.src}.mp4`} poster={`${it.src}.jpg`} controls preload="none" playsInline muted aria-label={it.nom} />
            <figcaption><h2>{it.nom}</h2><p>{it.sens}</p><span className="duree">{it.duree}</span></figcaption>
          </figure>
        ))}
      </div>
    );
  }
  return (
    <>
      {b.t === 'rayon' && b.signe && (
        <div className="rayon"><Glyphe signe={b.signe} couleur={f.css} /><h2>{b.titre}</h2><span>{MOTS[locale][b.signe]}</span></div>
      )}
      {b.vide && <p className="vide">{b.vide}</p>}
      {b.fiches && <Explorer items={b.fiches as Projet[]} css={f.css} code={b.code || f.code} locale={locale} fiche={fiche} onFiche={onFiche} allerProjet={allerProjet} />}
      {b.items && (
        <div className="grille">
          {(b.items as Item[]).map((it, i) => <Carte key={it.nom} it={it} code={b.code || f.code} i={i} ui={ui} locale={locale} ouvrirContact={ouvrirContact} />)}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------- futurs projets : un menu que l'on parcourt, une fiche par projet
function Explorer({ items, css, code = 'F', locale, fiche, onFiche, allerProjet }: { items: Projet[]; css: string; code?: string; locale: Locale; fiche?: string; onFiche: (id: string) => void; allerProjet: (id: string) => void }) {
  const [i, setI] = useState(() => {
    const n = items.findIndex((x) => x.id === fiche);
    return n >= 0 ? n : 0;
  });
  const liste = useRef<HTMLDivElement>(null);
  const boite = useRef<HTMLDivElement>(null);
  const depuisListe = useRef(false);
  useEffect(() => {
    const n = fiche ? items.findIndex((x) => x.id === fiche) : 0;
    if (n >= 0) setI(n);
    if (fiche && n >= 0 && !depuisListe.current) window.setTimeout(() => boite.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    depuisListe.current = false;
  }, [fiche, items]);
  const p = items[i] ?? items[0];
  if (!p) return null;
  const choisir = (n: number) => {
    setI(n);
    if (items[n].id === fiche) return;
    depuisListe.current = true;
    onFiche(items[n].id);
  };
  const clavier = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); e.stopPropagation();
    const n = (i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    choisir(n);
    (liste.current?.querySelectorAll('button')[n] as HTMLButtonElement | undefined)?.focus();
  };
  return (
    <div className="explorer" ref={boite} style={{ ['--c' as string]: css }}>
      <div className="ex-liste" role="tablist" aria-orientation="vertical" ref={liste} onKeyDown={clavier} hidden={items.length < 2}>
        {items.map((x, n) => (
          <button key={x.id} type="button" role="tab" aria-selected={n === i} tabIndex={n === i ? 0 : -1} onClick={() => choisir(n)}>
            <span className="ex-code">{code}.{String(n + 1).padStart(2, '0')}</span>
            <span className="ex-nom">{x.nom}</span>
            <span className="ex-statut">{x.statut}</span>
          </button>
        ))}
      </div>
      <article className="ex-fiche" role="tabpanel" key={p.id}>
        <header>
          <div className="ex-code">{code}.{String(i + 1).padStart(2, '0')} · {p.statut}</div>
          <h2>{p.nom}</h2>
          <p className="ex-sous">{p.sous}</p>
        </header>
        <div className="ex-corps">
          {p.objet && (
            <figure className="ex-objet">
              <Objet url={p.objet} css={css} />
              <PhraseGlyphes locale={locale} css={css} />
            </figure>
          )}
          <figure className="ex-film ex-scene">
            <Scene id={p.id} css={css} locale={locale} />
            <figcaption><i className="rec" />{locale === 'fr' ? 'en temps réel' : 'real time'}</figcaption>
          </figure>
          {p.video && <Video id={p.video} locale={locale} />}
          {p.film && (<figure className="ex-film-local"><video src={p.film} controls playsInline preload="metadata" /></figure>)}
          <div className="ex-texte">
            {p.texte.map((t) => <p key={t}><Lie texte={t} ici={p.id} aller={allerProjet} locale={locale} /></p>)}
            {p.liens && <p className="ex-liens">{p.liens.map(([t, u]) => <a key={u} href={u} target="_blank" rel="noopener noreferrer">{t} ↗</a>)}</p>}
            <dl>{p.reperes.flatMap(([k, v]) => [<dt key={`t${k}`}>{k}</dt>, <dd key={`d${k}`}><Lie texte={v} ici={p.id} aller={allerProjet} locale={locale} /></dd>])}</dl>
            <div className="tags">{p.tags.map((x) => <span key={x}>{x}</span>)}</div>
          </div>
        </div>
        {p.id === 'orca' && <Alphabet css={css} locale={locale} />}
      </article>
      <span className="sr-only" aria-live="polite">{locale === 'fr' ? `projet ${i + 1} sur ${items.length}` : `project ${i + 1} of ${items.length}`}</span>
    </div>
  );
}

// l'alphabet des opérateurs d'ORCA//GLYPH : la lettre d'Orca, son signe As-Simt, son mot, ce qu'elle fait, et pourquoi ce mot
const ALPHA_TXT = {
  fr: { titre: 'L’alphabet des opérateurs', intro: 'Dans Orca, chaque lettre majuscule est un opérateur : une petite machine qui agit à chaque pas d’horloge. ORCA//GLYPH garde la lettre et sa fonction, et lui donne un signe de l’alphabet As-Simt. Ce signe est une image, et son mot a été choisi pour ce que fait l’opérateur : D bat la mesure en lâchant un bang tous les N pas, comme la pluie qui tombe goutte à goutte. Lire un patch, c’est donc lire à la fois un programme et une phrase.', lettre: 'lettre', signe: 'signe', mot: 'mot', fait: 'fait', pourquoi: 'pourquoi ce mot' },
  en: { titre: 'The operator alphabet', intro: 'In Orca, each capital letter is an operator: a small machine that acts on every clock step. ORCA//GLYPH keeps the letter and its function, and gives it a sign from the As-Simt alphabet. That sign is an image, and its word was chosen for what the operator does: D keeps time by dropping a bang every N steps, like rain falling drop by drop. Reading a patch means reading a program and a sentence at once.', lettre: 'letter', signe: 'sign', mot: 'word', fait: 'does', pourquoi: 'why this word' },
};
function GlypheOp({ k, couleur }: { k: string; couleur: string }) {
  const rows = (GLYPHES.operateurs as Record<string, string[]>)[k] || [];
  return (
    <svg viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, r) => [...row].map((c, q) => (c === '#' ? <rect key={`${r}-${q}`} x={q} y={r} width={1} height={1} fill={couleur} /> : null)))}
    </svg>
  );
}
function Alphabet({ css, locale }: { css: string; locale: Locale }) {
  const T = ALPHA_TXT[locale]; const O = OPS[locale] as Record<string, { mot: string; fait: string; lien: string }>;
  return (
    <section className="ex-alphabet" aria-label={T.titre}>
      <h3 className="etiquette">{T.titre}</h3>
      <p>{T.intro}</p>
      <ol>
        {Object.entries(O).map(([k, o]) => (
          <li key={k}>
            <GlypheOp k={k} couleur={css} />
            <b>{k}</b>
            <span className="mot">{o.mot}</span>
            <span className="fait">{o.fait}</span>
            <span className="lien">{o.lien}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// la légende de l'objet 3D, écrite dans la Langue des images : des signes As-Simt, le verbe à la fin
// machine (l'objet) · paume (la main) · cercle (tourner)
const PHRASE = { fr: [['E119', 'machine', 'l’objet'], ['E083', 'paume', 'la main'], ['U', 'cercle', 'tourner']], en: [['E119', 'machine', 'the object'], ['E083', 'palm', 'the hand'], ['U', 'circle', 'to turn']] };
function PhraseGlyphes({ locale, css }: { locale: Locale; css: string }) {
  return (
    <figcaption className="phrase-glyphes" aria-label={locale === 'fr' ? 'glisser pour tourner l’objet' : 'drag to turn the object'}>
      {PHRASE[locale].map(([signe, mot, sens], i) => (
        <span key={signe} className="mot-glyphe">
          {signe.length === 1 ? <GlypheOp k={signe} couleur={i === 2 ? css : '#f2f0ea'} /> : <Glyphe signe={signe} couleur={i === 2 ? css : '#f2f0ea'} />}
          <em>{mot}</em><small>{sens}</small>
        </span>
      ))}
    </figcaption>
  );
}

// les projets qui se citent : chaque nom d'un autre projet du site devient un lien vers sa fiche
const NOMS_PROJETS: [string, string][] = [
  ['TEAMMATE.POTO', 'teammate'], ['TEAMMATE', 'teammate'], ['ORCA//GLYPH', 'orca'], ['CAVE // FOUR ROBOTS', 'cave'],
  ['SYSTEMA8OS.XT', 'systema'], ['systema8os.xt', 'systema'], ['TRIPODE AS-SIMT', 'tripode'], ['tripode AS-SIMT', 'tripode'],
  ['Langue des images', 'langue'], ['Language of images', 'langue'],
  ['AVATAR MÉTABOLIQUE SONORE', 'avatar'], ['Avatar métabolique sonore', 'avatar'], ['Sonic Metabolic Avatar', 'avatar'], ['SONIC METABOLIC AVATAR', 'avatar'],
  ['BILLY // STEAM DECK', 'billy'],
];
const MOTIF_PROJETS = new RegExp('(' + NOMS_PROJETS.map(([n]) => n.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|') + ')', 'g');
function Lie({ texte, ici, aller, locale }: { texte: string; ici: string; aller: (id: string) => void; locale: Locale }) {
  const morceaux = texte.split(MOTIF_PROJETS);
  return <>{morceaux.map((m, k) => {
    const id = NOMS_PROJETS.find(([n]) => n === m)?.[1];
    if (!id || id === ici) return m;
    return <button key={k} type="button" className="lien-projet" onClick={() => aller(id)} title={locale === 'fr' ? 'voir la fiche' : 'see the project'}>{m}</button>;
  })}</>;
}

// la vidéo d'un projet (YouTube) : une vignette d'abord, le lecteur ne se charge qu'au clic
function Video({ id, locale }: { id: string; locale: Locale }) {
  const [ouvert, setOuvert] = useState(false);
  const titre = locale === 'fr' ? 'la conférence performée, en vidéo' : 'the performed lecture, on video';
  return (
    <figure className="ex-video">
      {ouvert
        ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={titre} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        : <button type="button" onClick={() => setOuvert(true)} aria-label={titre} style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}><span>▶ {locale === 'fr' ? 'lire la vidéo' : 'play the video'}</span></button>}
      <figcaption>{titre} · <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">YouTube</a></figcaption>
    </figure>
  );
}

// l'objet réel d'un projet, en 3D, dans le trait du site
function Objet({ url, css }: { url: string; css: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let stop: (() => void) | null = null; let annule = false;
    import('./objet3d').then(({ lancerObjet }) => { if (!annule && ref.current) stop = lancerObjet(ref.current, url, css); });
    return () => { annule = true; stop?.(); };
  }, [url, css]);
  return <canvas ref={ref} role="img" aria-label="3D" />;
}

// le même article dans l'autre langue, pour que le panier garde les deux noms
function nomAutreLangue (id: number, locale: Locale) {
  const autre = CONTENU[locale === 'fr' ? 'en' : 'fr'] as Famille[];
  for (const g of autre) for (const b of g.blocs) for (const x of (b.items || []) as Item[]) if (x && typeof x === 'object' && x.panier === id) return x.nom;
  return '';
}

function Carte({ it, code, i, ui, locale, ouvrirContact }: { it: Item; code: string; i: number; ui: Ui; locale: Locale; ouvrirContact: (s: string) => void }) {
  const addItem = useCartStore((s) => s.addItem);
  const [ajoute, setAjoute] = useState(false);
  const ajouter = () => {
    if (!it.panier) return;
    const autre = nomAutreLangue(it.panier, locale) || it.nom;
    addItem({ productId: it.panier, name: locale === 'fr' ? { fr: it.nom, en: autre } : { fr: autre, en: it.nom }, price: it.prix === 'quote' ? 'quote' : 'coming', image: '' });
    setAjoute(true); window.setTimeout(() => setAjoute(false), 1200);
  };
  return (
    <article className={'prod' + (it.image ? ' large' : '')}>
      {it.image && (
        <figure className="prod-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={it.image} alt={it.alt || it.nom} loading="lazy" />
          {it.couleurs && <figcaption className="coloris">{it.couleurs.map(([n, c]) => <span key={n}><i style={{ background: c }} />{n}</span>)}</figcaption>}
        </figure>
      )}
      <div className="prod-corps">
      <div className="ref">{code}.{String(i + 1).padStart(2, '0')}</div>
      <h2>{it.nom}</h2>
      {it.glyphes && (
        <div className="nom-glyphes">
          <div className="mots">{it.glyphes.map(([sg, mot]) => <span key={sg} className="mot-glyphe"><Glyphe signe={sg} couleur="#ffb545" /><em>{mot}</em></span>)}</div>
          {it.glyphesSens && <small>{it.glyphesSens}</small>}
        </div>
      )}
      <p>{it.sens}</p>
      {it.collab && <p className="collab">{it.collab.texte} <a href={it.collab.lien} target="_blank" rel="noopener noreferrer">{it.collab.nom}</a></p>}
      {it.details && <dl className="details">{it.details.flatMap(([k, v]) => [<dt key={`t${k}`}>{k}</dt>, <dd key={`d${k}`}>{v}</dd>])}</dl>}
      {it.tags && <div className="tags">{it.tags.map((x) => <span key={x}>{x}</span>)}</div>}
      {it.prix && (
        <div className="pied">
          <span className="prix">{it.tarif || ui.prix[it.prix]}</span>
          {it.panier ? (
            <button type="button" className="btn" onClick={ajouter}>{ajoute ? ui.ajoute : ui.ajouter}</button>
          ) : (
            <button type="button" className="btn" onClick={() => ouvrirContact(it.nom)}>{it.commande || (it.prix === 'quote' ? ui.devis : ui.prevenir)}</button>
          )}
        </div>
      )}
      </div>
    </article>
  );
}

// ---------------------------------------------------------------- tiroirs : contact, panier, connexion
function Mail({ ui }: { ui: Ui }) {
  const [copie, setCopie] = useState(false);
  const mail = useRef<HTMLSpanElement>(null);
  const copier = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopie(true); } catch {
      if (mail.current) { const r = document.createRange(); r.selectNodeContents(mail.current); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); }
    }
  };
  return <div className="mail"><span ref={mail}>{EMAIL}</span><button type="button" className="btn doux" onClick={copier}>{copie ? ui.copie : ui.copier}</button></div>;
}

function TiroirContact({ sujet, ui, fermer }: { sujet: string; ui: Ui; fermer: () => void }) {
  // le formulaire de l'ancien site, repris tel quel : même API, même vérification anti-robot
  const t = useTranslations('contact');
  const locale = useLocale();
  const [champs, setChamps] = useState({ name: '', email: '', subject: sujet, message: '' });
  const [curseur, setCurseur] = useState(0);
  const [piege, setPiege] = useState('');
  const [etat, setEtat] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [erreur, setErreur] = useState('');
  const debut = useRef(Date.now());
  const humain = curseur >= 100;
  useEffect(() => { setChamps((c) => ({ ...c, subject: sujet })); }, [sujet]);
  const changer = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setChamps({ ...champs, [e.target.name]: e.target.value });
  const envoyer = async (e: FormEvent) => {
    e.preventDefault();
    if (!humain) { setEtat('error'); setErreur(t('form.humanCheckError')); return; }
    if (piege.trim()) { setEtat('error'); setErreur(t('form.error')); return; }
    setEtat('loading'); setErreur('');
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...champs, locale, antiBot: { sliderValue: curseur, honeypot: piege, elapsedMs: Date.now() - debut.current } }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || t('form.error'));
      setEtat('success'); setChamps({ name: '', email: '', subject: '', message: '' }); setCurseur(0); debut.current = Date.now();
    } catch (err) { setEtat('error'); setErreur(err instanceof Error ? err.message : t('form.error')); }
  };
  return (
    <>
      <div className="etiquette">{ui.contactTitre}</div>
      <p>{ui.contactTexte}</p>
      <form onSubmit={envoyer} className="formulaire">
        <label htmlFor="ct-nom">{t('form.name')} *<input id="ct-nom" name="name" type="text" autoComplete="name" value={champs.name} onChange={changer} required placeholder={t('form.namePlaceholder')} /></label>
        <label htmlFor="ct-email">{t('form.email')} *<input id="ct-email" name="email" type="email" autoComplete="email" value={champs.email} onChange={changer} required placeholder={t('form.emailPlaceholder')} /></label>
        <label htmlFor="ct-sujet">{t('form.subject')}<input id="ct-sujet" name="subject" type="text" value={champs.subject} onChange={changer} placeholder={t('form.subjectPlaceholder')} /></label>
        <label htmlFor="ct-msg">{t('form.message')} *<textarea id="ct-msg" name="message" rows={5} value={champs.message} onChange={changer} required placeholder={t('form.messagePlaceholder')} /></label>
        <div className="piege" aria-hidden="true"><label htmlFor="ct-site">Website</label><input id="ct-site" name="website" type="text" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} /></div>
        <label htmlFor="ct-robot" className="robot">{t('form.humanCheckLabel')} *
          <span className="note">{t('form.humanCheckHint')}</span>
          <input id="ct-robot" type="range" min={0} max={100} value={curseur} onChange={(e) => setCurseur(Number(e.target.value))} aria-describedby="ct-robot-etat" />
          <span id="ct-robot-etat" className={humain ? 'ok' : 'note'}>{humain ? t('form.humanCheckReady') : t('form.humanCheckProgress', { value: curseur })}</span>
        </label>
        {etat === 'error' && <p className="erreur" role="alert">{erreur || t('form.error')}</p>}
        {etat === 'success' && <p className="ok" role="status">{t('form.success')}</p>}
        <button type="submit" className="btn plein" disabled={etat === 'loading' || !humain}>{etat === 'loading' ? t('form.sending') : humain ? t('form.submit') : t('form.submitLocked')}</button>
      </form>
      <p className="note">{ui.ouEcrire}</p>
      <Mail ui={ui} />
      <p className="note">{ui.reponse}</p>
      <div className="ligne"><Link href="/legal" className="lien">{ui.legal}</Link><Link href="/terms" className="lien">{ui.cgvLong}</Link></div>
      <button type="button" className="btn doux" onClick={fermer}>{ui.fermer}</button>
    </>
  );
}

function TiroirPanier({ ui, locale, fermer }: { ui: Ui; locale: Locale; fermer: () => void }) {
  const items = useCartStore((s) => s.items);
  const update = useCartStore((s) => s.updateQuantity);
  const vider = useCartStore((s) => s.clearCart);
  const [commande, setCommande] = useState(false);
  return (
    <>
      <div className="etiquette">{ui.panierTitre}</div>
      <ul>
        {!items.length && <li>{ui.vide}</li>}
        {items.map((it) => (
          <li key={it.productId}>
            <span>{it.name[locale]}</span>
            <span className="qte">
              <button type="button" aria-label="−" onClick={() => update(it.productId, it.quantity - 1)}>−</button>
              <b>{it.quantity}</b>
              <button type="button" aria-label="+" onClick={() => update(it.productId, it.quantity + 1)}>+</button>
            </span>
          </li>
        ))}
      </ul>
      {!!items.length && (
        <div className="ligne">
          <button type="button" className="btn plein" onClick={() => setCommande(true)}>{ui.commander}</button>
          <button type="button" className="btn doux" onClick={vider}>{ui.vider}</button>
        </div>
      )}
      {commande && <><p className="note">{ui.commandeBientot}</p><Mail ui={ui} /></>}
      <button type="button" className="btn doux" onClick={fermer}>{ui.fermer}</button>
    </>
  );
}

function TiroirConnexion({ inscription, ui, basculer, fermer }: { inscription: boolean; ui: Ui; basculer: (v: boolean) => void; fermer: () => void }) {
  const t = useTranslations('auth');
  const tr = useTranslations('auth.register');
  const locale = useLocale();
  const tc = useTranslations('contact');
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [nom, setNom] = useState('');
  const [msg, setMsg] = useState('');
  const [charge, setCharge] = useState(false);
  const [curseur, setCurseur] = useState(0);
  const [piege, setPiege] = useState('');
  const debut = useRef(Date.now());
  const humain = curseur >= 100;

  if (session) {
    return (
      <>
        <div className="etiquette">{ui.connexion.toUpperCase()}</div>
        <p>{ui.bonjour} · {session.user?.name || session.user?.email}</p>
        <div className="ligne">
          <Link href="/profile" className="btn doux">{ui.profil}</Link>
          <button type="button" className="btn doux" onClick={() => signOut()}>{ui.deconnexion}</button>
        </div>
        <button type="button" className="btn doux" onClick={fermer}>{ui.fermer}</button>
      </>
    );
  }

  const envoyer = async (e: FormEvent) => {
    e.preventDefault(); setMsg(''); setCharge(true);
    try {
      if (inscription) {
        if (!humain || piege.trim()) { setMsg(tc('form.humanCheckError')); return; }
        const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: mdp, name: nom, locale, antiBot: { sliderValue: curseur, honeypot: piege, elapsedMs: Date.now() - debut.current } }) });
        const d = await r.json();
        const erreurs: Record<string, string> = {
          emailExists: tr('emailExists'),
          invalidEmail: tr('invalidEmail'),
          passwordTooShort: tr('passwordTooShort'),
          allFieldsRequired: tr('allFieldsRequired'),
          antiBot: tc('form.humanCheckError'),
        };
        if (!r.ok) setMsg(erreurs[d.error] || t('error'));
        else { setMsg(tr('success')); setCurseur(0); debut.current = Date.now(); }
      } else {
        const r = await signIn('credentials', { email, password: mdp, redirect: false });
        if (r?.error === 'EMAIL_NOT_VERIFIED') setMsg(t('emailNotVerified'));
        else if (r?.error) setMsg(t('invalidCredentials'));
        else fermer();
      }
    } catch { setMsg(t('error')); } finally { setCharge(false); setMdp(''); }
  };

  return (
    <>
      <div className="etiquette">{(inscription ? tr('title') : t('login')).toUpperCase()}</div>
      <form onSubmit={envoyer}>
        {inscription && <label htmlFor="compte-nom">{t('name')}<input id="compte-nom" type="text" autoComplete="name" value={nom} onChange={(e) => setNom(e.target.value)} required /></label>}
        <label htmlFor="compte-email">{t('email')}<input id="compte-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label htmlFor="compte-mdp">{t('password')}<input id="compte-mdp" type="password" autoComplete={inscription ? 'new-password' : 'current-password'} minLength={inscription ? 8 : undefined} value={mdp} onChange={(e) => setMdp(e.target.value)} required /></label>
        {inscription && (
          <>
            <div className="piege" aria-hidden="true"><label htmlFor="compte-site">Website</label><input id="compte-site" name="website" type="text" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} /></div>
            <label htmlFor="compte-robot" className="robot">{tc('form.humanCheckLabel')} *
              <span className="note">{tc('form.humanCheckHint')}</span>
              <input id="compte-robot" type="range" min={0} max={100} value={curseur} onChange={(e) => setCurseur(Number(e.target.value))} />
              <span className={humain ? 'ok' : 'note'}>{humain ? tc('form.humanCheckReady') : tc('form.humanCheckProgress', { value: curseur })}</span>
            </label>
          </>
        )}
        <button type="submit" className="btn plein" disabled={charge || (inscription && !humain)}>{charge ? (inscription ? t('signingUp') : t('signingIn')) : (inscription ? t('signUp') : t('signIn'))}</button>
        {msg && <p className="note">{msg}</p>}
      </form>
      {!inscription && <button type="button" className="btn doux" onClick={() => signIn('google', { callbackUrl: window.location.href })}>{t('signInWithGoogle')}</button>}
      <div className="ligne">
        <button type="button" className="lien" onClick={() => basculer(!inscription)}>{inscription ? `${t('alreadyHaveAccount')} ${t('signIn')}` : `${t('noAccount')} ${t('signUp')}`}</button>
      </div>
      <button type="button" className="btn doux" onClick={fermer}>{ui.fermer}</button>
    </>
  );
}

function Langue() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <span className="langue">
      {(['fr', 'en'] as const).map((l) => (
        <button key={l} type="button" aria-current={locale === l} onClick={() => router.replace(pathname, { locale: l })}>{l}</button>
      ))}
    </span>
  );
}
