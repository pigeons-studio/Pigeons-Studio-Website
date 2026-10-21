'use client';

// Le site Pigeons Studio : le viseur ORCA//GLYPH, repris fidèlement de la page Claude.
// En 3D, six étages et leurs glyphes-menus ; la molette traverse les étages ; un clic descend en page 2D.
// En plus de la page Claude : le français et l'anglais, un vrai panier et la vraie connexion du site.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { signIn, signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useCartStore } from '@/app/store/cartStore';
import GLYPHES from './glyphes.json';
import CONTENU from './contenu.json';
import type { World as Monde, Etage } from './engine';
import './orca.css';

type Locale = 'fr' | 'en';
type Mode = '3d' | 'vers2d' | '2d' | 'vers3d';
type Prix = 'coming' | 'quote' | 'soon';
type Item = { nom: string; sens: string; tags?: string[]; prix?: Prix; panier?: number; src?: string; duree?: string };
type Bloc = { t: string; p?: string; titre?: string; sur?: string; duo?: string; legende?: string; signe?: string; code?: string; vide?: string; items?: unknown[] };
type Famille = { id: string; nom: string; code: string; signe: string; pourquoi: string; teinte: number; css: string; blocs: Bloc[] };

const EMAIL = 'contact@punkhazard.org';

// les petits patchs Orca de chaque étage ; les commentaires suivent la langue
const PATCHS: Record<Locale, Record<string, string[]>> = {
  fr: {
    bio: ['', '..#PIGEONS.STUDIO#', '', '..#KOO.DES#..........#JULIEN.THOMAS#', '', '..2C4................4C8', '...0..................0', '..1D4................1D8', '', '...:03C...............:05G'],
    projets: ['', '..#PROJETS#', '', '..#AS.SIMT#...#GO2#...#INSTALLATIONS#', '', '..4C8....1D4', '...0', '..........:03C'],
    services: ['', '..#SERVICES#', '', '..#OBJETS.AUDIO#..#CAPTEURS#..#3D#', '', '..2C4....1D2', '...0', '..........:13E'],
    futur: ['', '..#FUTURS.PROJETS#', '', '..#ORCA.GLYPH#..#CAVE#..#TEAMMATE#', '', '..1D8...........8-1', '', '.........:15c'],
    boutique: ['', '..#BOUTIQUE#', '', '..#ACCESSOIRES#..#GEAR#..#MUSIQUE#', '', '..1D2.8TCDEGAcdg', '', '......:14'],
    logiciels: ['', '..#LOGICIELS#', '', '..#WEB#...#FIRMWARE#...#PC#', '', '..4C8....1D4', '...0', '..........:02E'],
  },
  en: {
    bio: ['', '..#PIGEONS.STUDIO#', '', '..#KOO.DES#..........#JULIEN.THOMAS#', '', '..2C4................4C8', '...0..................0', '..1D4................1D8', '', '...:03C...............:05G'],
    projets: ['', '..#PROJECTS#', '', '..#AS.SIMT#...#GO2#...#INSTALLATIONS#', '', '..4C8....1D4', '...0', '..........:03C'],
    services: ['', '..#SERVICES#', '', '..#AUDIO.OBJECTS#..#SENSORS#..#3D#', '', '..2C4....1D2', '...0', '..........:13E'],
    futur: ['', '..#FUTURE.PROJECTS#', '', '..#ORCA.GLYPH#..#CAVE#..#TEAMMATE#', '', '..1D8...........8-1', '', '.........:15c'],
    boutique: ['', '..#SHOP#', '', '..#ACCESSORIES#..#GEAR#..#MUSIC#', '', '..1D2.8TCDEGAcdg', '', '......:14'],
    logiciels: ['', '..#SOFTWARE#', '', '..#WEB#...#FIRMWARE#...#PC#', '', '..4C8....1D4', '...0', '..........:02E'],
  },
};

// les signes de l'alphabet partagé, et leur mot
const MOTS: Record<Locale, Record<string, string>> = {
  fr: { E113: 'double', E132: 'faire', E140: 'donner', E0EE: 'graine', E083: 'paume', E130: 'signal', E082: 'peau', E119: 'machine', E11C: 'vibration' },
  en: { E113: 'double', E132: 'make', E140: 'give', E0EE: 'seed', E083: 'palm', E130: 'signal', E082: 'skin', E119: 'machine', E11C: 'vibration' },
};

const UI = {
  fr: {
    connexion: 'connexion', contact: 'contact', panier: 'panier', retour: '◂ 3D', etage: 'étage', etages: (n: number) => `${n} étages`,
    aide: 'molette : traverser les étages · clic : entrer', entrer: (n: number) => `étage ${n} · cliquer pour entrer`,
    ici: 'tu es ici', aller: (n: number) => `aller à l'étage ${n}`, rubriques: 'rubriques',
    prix: { coming: 'À venir', quote: 'Sur devis', soon: 'Bientôt disponible' } as Record<Prix, string>,
    prevenir: 'être prévenu', devis: 'demander un devis', ajouter: 'ajouter au panier', ajoute: 'ajouté',
    contactTitre: 'CONTACT', contactTexte: 'Marques, institutions, robotique et IA : parlons de votre projet.', aPropos: 'à propos de : ',
    copier: 'copier', copie: 'copié', reponse: 'Réponse généralement sous 24-48h.', fermer: 'fermer', legal: 'mentions légales', cgv: 'cgv',
    panierTitre: 'PANIER', vide: 'Vide pour l’instant.', vider: 'vider', commander: 'passer la commande',
    commandeBientot: 'Le paiement en ligne arrive bientôt. Pour commander, écrivez au studio :',
    profil: 'mon profil', bonjour: 'connecté·e', deconnexion: 'déconnexion',
  },
  en: {
    connexion: 'login', contact: 'contact', panier: 'cart', retour: '◂ 3D', etage: 'floor', etages: (n: number) => `${n} floors`,
    aide: 'scroll: move through the floors · click: enter', entrer: (n: number) => `floor ${n} · click to enter`,
    ici: 'you are here', aller: (n: number) => `go to floor ${n}`, rubriques: 'sections',
    prix: { coming: 'Coming soon', quote: 'On quote', soon: 'Coming soon' } as Record<Prix, string>,
    prevenir: 'get notified', devis: 'request a quote', ajouter: 'add to cart', ajoute: 'added',
    contactTitre: 'CONTACT', contactTexte: 'Brands, institutions, robotics and AI: let’s talk about your project.', aPropos: 'about: ',
    copier: 'copy', copie: 'copied', reponse: 'We usually reply within 24-48h.', fermer: 'close', legal: 'legal notice', cgv: 'terms',
    panierTitre: 'CART', vide: 'Empty for now.', vider: 'empty', commander: 'checkout',
    commandeBientot: 'Online payment is coming soon. To order, write to the studio:',
    profil: 'my profile', bonjour: 'signed in', deconnexion: 'log out',
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
  const totalPanier = useCartStore((s) => s.getTotalItems());

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
        textes: { entrer: ui.entrer },
        onMode: (m, e) => {
          setMode(m); setEtage(e);
          if (m === '2d') { setVisible(true); pageRef.current?.scrollTo(0, 0); } else setVisible(false);
        },
      });
      mondeRef.current = monde;
    });
    return () => { annule = true; monde?.detruire(); mondeRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // d'une page à l'autre en 2D : la page glisse, la nouvelle apparaît sur la dalle
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
          <button id="connexion" type="button" onClick={() => setTiroir(tiroir?.quoi === 'connexion' ? null : { quoi: 'connexion', inscription: false })}>{ui.connexion}</button>
          <button id="panier" type="button" onClick={() => setTiroir(tiroir?.quoi === 'contact' ? null : { quoi: 'contact', sujet: '' })}>{ui.contact}</button>
          <Langue />
        </div>
        <div className="c bg"><span id="etat"><b>{etatLabel}</b>{etatTexte}</span>{mode === '3d' && <span className="aide">{ui.aide}</span>}</div>
        <div className="c bd"><button id="retour" type="button" hidden={mode !== '2d'} onClick={() => mondeRef.current?.remonter()}>{ui.retour}</button></div>
      </div>
      <div id="trk" ref={trkRef} aria-hidden="true"><i /><i /><i /><i /><span /></div>
      {survolHtml && mode === '2d' && <TrackerHtml g={FAMILLES[survolHtml.i]} box={survolHtml.box} ici={survolHtml.i === etage} n={survolHtml.i} ui={ui} locale={locale} />}

      <main id="page" ref={pageRef} className={visible && mode === '2d' ? 'on' : ''} aria-hidden={mode !== '2d'}>
        <div className="dedans" id="contenu">
          <nav className="familles" aria-label={ui.rubriques}>
            {FAMILLES.map((g, i) => (
              <button key={g.id} type="button" aria-label={g.nom} aria-current={i === etage}
                onPointerEnter={(e) => setSurvolHtml({ i, box: e.currentTarget.getBoundingClientRect() })}
                onPointerLeave={() => setSurvolHtml(null)}
                onClick={() => changer(i)}>
                <Glyphe signe={g.signe} couleur={i === etage ? g.css : '#8a8780'} />
              </button>
            ))}
          </nav>
          <div className="titre">
            <Glyphe signe={f.signe} couleur={f.css} />
            <div><h1>{f.nom}</h1><p>{MOTS[locale][f.signe]}{f.pourquoi !== MOTS[locale][f.signe] ? ` · ${f.pourquoi}` : ''}</p></div>
          </div>
          {f.blocs.map((b, i) => <BlocVue key={`${f.id}-${i}`} b={b} f={f} ui={ui} locale={locale} ouvrirContact={(sujet) => setTiroir({ quoi: 'contact', sujet })} />)}
        </div>
      </main>

      {tiroir && (
        <aside id="tiroir" aria-label={tiroir.quoi}>
          {tiroir.quoi === 'contact' && <TiroirContact sujet={tiroir.sujet} ui={ui} fermer={() => setTiroir(null)} />}
          {tiroir.quoi === 'panier' && <TiroirPanier ui={ui} locale={locale} fermer={() => setTiroir(null)} />}
          {tiroir.quoi === 'connexion' && <TiroirConnexion inscription={tiroir.inscription} ui={ui} basculer={(v) => setTiroir({ quoi: 'connexion', inscription: v })} fermer={() => setTiroir(null)} />}
        </aside>
      )}
    </div>
  );
}

function TrackerHtml({ g, box, ici, n, ui, locale }: { g: Famille; box: DOMRect; ici: boolean; n: number; ui: Ui; locale: Locale }) {
  const m = 6;
  const droite = box.right + 220 > window.innerWidth;
  return (
    <div className="trk on" style={{ ['--c' as string]: g.css, transform: `translate(${box.left - m}px,${box.top - m}px)`, width: box.width + 2 * m, height: box.height + 2 * m }} aria-hidden="true">
      <i /><i /><i /><i />
      <span style={droite ? { left: 'auto', right: '100%', marginLeft: 0, marginRight: 10, textAlign: 'right' } : undefined}>
        {MOTS[locale][g.signe]} → {g.nom.toUpperCase()}
        <em>{ici ? ui.ici : ui.aller(n)}</em>
      </span>
    </div>
  );
}

// ---------------------------------------------------------------- les blocs d'une page 2D (comme remplir() de la page Claude)
function BlocVue({ b, f, ui, locale, ouvrirContact }: { b: Bloc; f: Famille; ui: Ui; locale: Locale; ouvrirContact: (s: string) => void }) {
  if (b.t === 'lead') return <div className="lead"><p className="sur">{b.sur}</p><p className="duo">{b.duo}</p><p className="legende">{b.legende}</p></div>;
  if (b.t === 'texte') return <section className="texte">{b.titre && <h2 className="etiquette">{b.titre}</h2>}<p>{b.p}</p></section>;
  if (b.t === 'vide') return <p className="vide">{b.p}</p>;
  if (b.t === 'deux') return <div className="bio">{(b.items as string[][]).map(([n, r, p]) => <section key={n}><h3>{n}</h3><h2>{r}</h2><p>{p}</p></section>)}</div>;
  if (b.t === 'liste') return <section className="liste"><h2 className="etiquette">{b.titre}</h2><dl>{(b.items as string[][]).flatMap(([k, v]) => [<dt key={`t${k}`}>{k}</dt>, <dd key={`d${k}`}>{v}</dd>])}</dl></section>;
  if (b.t === 'devis') return <div className="pied"><button type="button" className="btn" onClick={() => ouvrirContact('')}>{ui.devis}</button></div>;
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
      {b.items && (
        <div className="grille">
          {(b.items as Item[]).map((it, i) => <Carte key={it.nom} it={it} code={b.code || f.code} i={i} ui={ui} locale={locale} ouvrirContact={ouvrirContact} />)}
        </div>
      )}
    </>
  );
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
    <article className="prod">
      <div className="ref">{code}.{String(i + 1).padStart(2, '0')}</div>
      <h2>{it.nom}</h2>
      <p>{it.sens}</p>
      {it.tags && <div className="tags">{it.tags.map((x) => <span key={x}>{x}</span>)}</div>}
      {it.prix && (
        <div className="pied">
          <span className="prix">{ui.prix[it.prix]}</span>
          {it.panier ? (
            <button type="button" className="btn" onClick={ajouter}>{ajoute ? ui.ajoute : ui.ajouter}</button>
          ) : (
            <button type="button" className="btn" onClick={() => ouvrirContact(it.nom)}>{it.prix === 'quote' ? ui.devis : ui.prevenir}</button>
          )}
        </div>
      )}
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
  return (
    <>
      <div className="etiquette">{ui.contactTitre}</div>
      <p>{ui.contactTexte}</p>
      {sujet && <p className="sujet">{ui.aPropos}{sujet}</p>}
      <Mail ui={ui} />
      <p className="note">{ui.reponse}</p>
      <div className="ligne"><Link href="/legal" className="lien">{ui.legal}</Link><Link href="/terms" className="lien">{ui.cgv}</Link></div>
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
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [nom, setNom] = useState('');
  const [msg, setMsg] = useState('');
  const [charge, setCharge] = useState(false);

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
        const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: mdp, name: nom }) });
        const d = await r.json();
        if (!r.ok) setMsg(d.error || tr('allFieldsRequired'));
        else { setMsg(tr('success')); window.setTimeout(() => basculer(false), 1500); }
      } else {
        const r = await signIn('credentials', { email, password: mdp, redirect: false });
        if (r?.error) setMsg(t('invalidCredentials')); else fermer();
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
        <button type="submit" className="btn plein" disabled={charge}>{charge ? (inscription ? t('signingUp') : t('signingIn')) : (inscription ? t('signUp') : t('signIn'))}</button>
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
