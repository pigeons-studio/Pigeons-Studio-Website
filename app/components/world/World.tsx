'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Product } from '@/app/components/ProductCard';
import productsData from '@/data/products.json';
import { softwaresCatalog } from '@/lib/softwares';
import GLYPHES from './glyphes.json';
import type { World as Monde, Etage } from './engine';
import styles from './World.module.css';

// Les étages du site, du rez-de-chaussée vers le haut, chacun sous un signe de l'alphabet partagé As-Simt.
const ETAGES = [
  { id: 'bio', signe: 'E113', teinte: 0xf2f0ea, css: '#f2f0ea', page: '/about' },
  { id: 'projets', signe: 'E132', teinte: 0xd8d4ff, css: '#c9c4ff', page: '/projects' },
  { id: 'services', signe: 'E140', teinte: 0x9fd8ff, css: '#9fd8ff', page: '/services' },
  { id: 'futur', signe: 'E0EE', teinte: 0xb6ff8a, css: '#b6ff8a', page: null },
  { id: 'boutique', signe: 'E083', teinte: 0xffb545, css: '#ffb545', page: '/shop' },
  { id: 'logiciels', signe: 'E130', teinte: 0xe0e0e0, css: '#cfcfcf', page: '/softwares' },
] as const;
type EtageId = (typeof ETAGES)[number]['id'];

// Un petit patch Orca par étage (commentaires en #…#, quelques opérateurs qui tournent).
const PATCHS: Record<EtageId, string[]> = {
  bio: ['', '..#PIGEONS.STUDIO#', '', '..#KOO.DES#..........#JULIEN.THOMAS#', '', '..2C4................4C8', '...0..................0', '..1D4................1D8', '', '...:03C...............:05G'],
  projets: ['', '..#PROJETS#', '', '..#AS.SIMT#...#GO2#...#INSTALLATIONS#', '', '..4C8....1D4', '...0', '..........:03C'],
  services: ['', '..#SERVICES#', '', '..#OBJETS.AUDIO#..#CAPTEURS#..#3D#', '', '..2C4....1D2', '...0', '..........:13E'],
  futur: ['', '..#FUTURS.PROJETS#', '', '..#ORCA.GLYPH#..#CAVE#..#TEAMMATE#', '', '..1D8...........8-1', '', '.........:15c'],
  boutique: ['', '..#BOUTIQUE#', '', '..#ACCESSOIRES#..#GEAR#..#MUSIQUE#', '', '..1D2.8TCDEGAcdg', '', '......:14'],
  logiciels: ['', '..#LOGICIELS#', '', '..#WEB#...#FIRMWARE#...#PC#', '', '..4C8....1D4', '...0', '..........:02E'],
};

const FILMS = [
  { id: 'orca', src: '/films/orca-glyph-explication' },
  { id: 'cave', src: '/films/cave-four-robots' },
  { id: 'langue', src: '/films/language-of-images' },
  { id: 'pigeons', src: '/films/teammate-poto-pigeons' },
  { id: 'ecrans', src: '/films/teammate-poto-les-vrais-ecrans' },
] as const;

type Mode = '3d' | 'vers2d' | '2d' | 'vers3d';

export function Glyphe({ signe, couleur, className }: { signe: string; couleur: string; className?: string }) {
  const rows = (GLYPHES.signes as Record<string, string[]>)[signe] || [];
  return (
    <svg viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {rows.flatMap((row, r) => [...row].map((c, q) => (c === '#' ? <rect key={`${r}-${q}`} x={q} y={r} width={1} height={1} fill={couleur} /> : null)))}
    </svg>
  );
}

export default function World() {
  const t = useTranslations('world');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const mondeRef = useRef<Monde | null>(null);
  const [mode, setMode] = useState<Mode>('3d');
  const [etage, setEtage] = useState(0);
  const [visible, setVisible] = useState(false);

  const nomEtage = (i: number) => t(`floors.${ETAGES[i].id}.nom`);

  useEffect(() => {
    if (!canvasRef.current || !trackerRef.current) return;
    let monde: Monde | null = null;
    let annule = false;
    import('./engine').then(({ createWorld }) => {
      if (annule || !canvasRef.current || !trackerRef.current) return;
      const etages: Etage[] = ETAGES.map((e) => ({ id: e.id, signe: e.signe, teinte: e.teinte, css: e.css, nom: t(`floors.${e.id}.nom`), mot: t(`signes.${e.signe}`) }));
      monde = createWorld({
        canvas: canvasRef.current,
        tracker: trackerRef.current,
        etages,
        patchs: PATCHS,
        textes: { entrer: (n) => t('entrer', { n }) },
        onMode: (m, e) => {
          setMode(m); setEtage(e);
          if (m === '2d') { setVisible(true); pageRef.current?.scrollTo(0, 0); } else setVisible(false);
        },
      });
      mondeRef.current = monde;
    });
    return () => { annule = true; monde?.detruire(); mondeRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const m = mondeRef.current; if (!m) return;
      if (e.key === 'Escape' && mode === '2d') m.remonter();
      if (mode === '3d' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { m.avancer(e.key === 'ArrowDown' ? 1 : -1); e.preventDefault(); }
      if (mode === '3d' && e.key === 'Enter' && m.etageVise() >= 0) m.descendre(m.etageVise());
      if (mode === '2d' && (e.key === 'PageUp' || e.key === 'PageDown')) {
        const n = etage + (e.key === 'PageUp' ? 1 : -1);
        if (n >= 0 && n < ETAGES.length) changer(n);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // d'une page à l'autre en 2D : la page glisse, puis la nouvelle apparaît sur la dalle
  const changer = (n: number) => {
    if (n === etage) return;
    setVisible(false);
    window.setTimeout(() => { mondeRef.current?.changer(n); setEtage(n); setVisible(true); pageRef.current?.scrollTo(0, 0); }, 260);
  };

  const f = ETAGES[etage];
  const etat = mode === '3d' ? t('etages', { n: ETAGES.length }) : `${t('etage')} ${etage} · ${nomEtage(etage)}`;

  return (
    <div className={styles.monde}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div ref={trackerRef} className={styles.tracker} aria-hidden="true"><i /><i /><i /><i /><span /></div>

      <div className={styles.barre}>
        <span><b>{t(`etats.${mode}`)}</b> · {etat}</span>
        {mode === '3d' && <span className={styles.aide}>{t('aide')}</span>}
      </div>
      <div className={styles.barreDroite}>
        {mode === '2d' ? (
          <button type="button" onClick={() => mondeRef.current?.remonter()}>{t('retour')}</button>
        ) : (
          <nav className={styles.legal}>
            <Link href="/legal">legal</Link>
            <Link href="/terms">cgv</Link>
          </nav>
        )}
      </div>

      {/* navigation de secours, lisible sans la 3D (clavier, lecteurs d'écran) */}
      {mode === '3d' && (
        <nav className={styles.index} aria-label={t('rubriques')}>
          {ETAGES.map((e, i) => (
            <button key={e.id} type="button" onClick={() => mondeRef.current?.descendre(i)} title={`${t(`signes.${e.signe}`)} → ${nomEtage(i)}`}>
              <Glyphe signe={e.signe} couleur={e.css} className={styles.indexGlyphe} />
              <span>{nomEtage(i)}</span>
            </button>
          ))}
        </nav>
      )}

      <div ref={pageRef} className={`${styles.page} ${visible && mode === '2d' ? styles.on : ''}`} aria-hidden={mode !== '2d'}>
        <div className={styles.dedans}>
          <nav className={styles.familles} aria-label={t('rubriques')}>
            {ETAGES.map((e, i) => (
              <button key={e.id} type="button" aria-current={i === etage} title={`${t(`signes.${e.signe}`)} → ${nomEtage(i)}`} onClick={() => changer(i)}>
                <Glyphe signe={e.signe} couleur={i === etage ? e.css : '#8a8780'} />
              </button>
            ))}
          </nav>
          <div className={styles.titre}>
            <Glyphe signe={f.signe} couleur={f.css} className={styles.titreGlyphe} />
            <div>
              <h1>{nomEtage(etage)}</h1>
              <p>{t(`signes.${f.signe}`)}{t(`floors.${f.id}.pourquoi`) !== t(`signes.${f.signe}`) ? ` · ${t(`floors.${f.id}.pourquoi`)}` : ''}</p>
            </div>
          </div>
          <Contenu id={f.id} css={f.css} />
          {f.page && <Link href={f.page} className={styles.complete}>{t('pageComplete')} →</Link>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- le contenu de chaque étage, tiré des messages du site
function Contenu({ id, css }: { id: EtageId; css: string }) {
  const t = useTranslations('world');
  const h = useTranslations('home');
  const a = useTranslations('about');
  const s = useTranslations('softwares');
  const sh = useTranslations('shop');
  const locale = useLocale() as 'fr' | 'en';
  const fort = (chunks: ReactNode) => <span className={styles.fort}>{chunks}</span>;

  if (id === 'bio') {
    const kooP = h.raw('sections.duo.koo.paragraphs') as string[];
    return (
      <>
        <div className={styles.lead}>
          <p className={styles.sur}>{h('badge')}</p>
          <p className={styles.duo}>{h('duoLine')}</p>
          <p className={styles.legende}>{h('duoCaption')}</p>
        </div>
        <p className={styles.texte}>{a('sections.mission.content')}</p>
        <div className={styles.deux}>
          <section><h3>{h('sections.duo.koo.name')}</h3><h2>{h('sections.duo.koo.role')}</h2>{kooP.slice(0, 2).map((p) => <p key={p}>{p}</p>)}</section>
          <section><h3>{h('sections.duo.julien.name')}</h3><h2>{h('sections.duo.julien.role')}</h2><p>{h('sections.duo.julien.description')}</p></section>
        </div>
        <section>
          <h2 className={styles.etiquette}>{h('sections.duo.history.title')}</h2>
          {(['p1', 'p2', 'p3'] as const).map((k) => <p key={k} className={styles.texte}>{h.rich(`sections.duo.history.${k}`, { matrice: fort, eightos: fort })}</p>)}
        </section>
        <Liste titre={t('bio.references')} items={[
          [h('sections.nike.title'), h('sections.nike.description')],
          [h('sections.references.institutions.title'), h('sections.references.institutions.description')],
          [h('sections.references.residencies.title'), h('sections.references.residencies.description')],
          [h('sections.references.press.title'), h('sections.references.press.description')],
          [h('sections.ecosystem.title'), (h.raw('sections.ecosystem.paragraphs') as string[])[0]],
        ]} />
      </>
    );
  }

  if (id === 'projets') {
    const projets = ['as-simt', 'go2', 'installations'];
    const parcours = ['intuition', 'selm', 'activateCities'];
    return (
      <>
        <p className={styles.texte}>{h('sections.work.subtitle')}</p>
        <div className={styles.grille}>
          {projets.map((p, i) => (
            <article key={p} className={styles.carte}>
              <div className={styles.ref}>P.{String(i + 1).padStart(2, '0')}</div>
              <h2>{h(`sections.projects.items.${p}.title`)}</h2>
              <p>{h(`sections.projects.items.${p}.description`)}</p>
              <Tags tags={h.raw(`sections.projects.items.${p}.tags`) as string[]} />
            </article>
          ))}
        </div>
        <Liste titre={h('sections.duo.highlights.title')} items={parcours.map((p) => [
          `${h(`sections.duo.highlights.items.${p}.title`)} · ${h(`sections.duo.highlights.items.${p}.meta`)}`,
          h(`sections.duo.highlights.items.${p}.description`),
        ])} />
      </>
    );
  }

  if (id === 'services') {
    const activites = ['data', 'consulting', 'direction', 'digitalArt', 'physical', 'cdm', 'robotic'];
    const services = ['pcb', 'electronics', 'integration', 'design', 'scenography', 'go2'];
    return (
      <>
        <p className={styles.texte}>{h('sections.contact.description')}</p>
        <Liste titre={t('services.activites')} items={activites.map((k) => [h(`sections.activities.items.${k}.title`), h(`sections.activities.items.${k}.description`)])} />
        <div className={styles.grille}>
          {services.map((k, i) => (
            <article key={k} className={styles.carte}>
              <div className={styles.ref}>S.{String(i + 1).padStart(2, '0')}</div>
              <h2>{h(`sections.services.items.${k}.title`)}</h2>
              <p>{h(`sections.services.items.${k}.description`)}</p>
              <Tags tags={h.raw(`sections.services.items.${k}.features`) as string[]} />
            </article>
          ))}
        </div>
        <Link href="/contact" className={styles.bouton}>{t('services.devis')}</Link>
      </>
    );
  }

  if (id === 'futur') {
    return (
      <>
        <p className={styles.texte}>{t('futur.intro')}</p>
        <div className={styles.films}>
          {FILMS.map((film) => (
            <figure key={film.id} className={styles.film}>
              <video src={`${film.src}.mp4`} poster={`${film.src}.jpg`} controls preload="none" playsInline muted aria-label={t(`futur.films.${film.id}.nom`)} />
              <figcaption>
                <h2>{t(`futur.films.${film.id}.nom`)}</h2>
                <p>{t(`futur.films.${film.id}.sens`)}</p>
                <span className={styles.duree}>{t(`futur.films.${film.id}.duree`)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </>
    );
  }

  if (id === 'boutique') {
    const produits = (productsData as Product[]).filter((p) => !/fake/i.test(p.name.en));
    const sorties = h.raw('sections.duo.koo.releases.items') as string[];
    return (
      <>
        <p className={styles.texte}>{t('boutique.intro')} {t('boutique.paiement')}</p>
        <Rayon signe="E082" css={css} titre={t('boutique.accessoires')} mot={t('signes.E082')} />
        <p className={styles.vide}>{t('boutique.accessoiresVide')}</p>
        <Rayon signe="E119" css={css} titre={t('boutique.gear')} mot={t('signes.E119')} />
        <div className={styles.grille}>
          {produits.map((p, i) => {
            const prix = p.price === 'coming' ? sh('price.coming') : p.price === 'quote' ? sh('price.quote') : String(p.price);
            return (
              <article key={p.id} className={styles.carte}>
                <div className={styles.ref}>G.{String(i + 1).padStart(2, '0')}</div>
                <h2>{p.name[locale]}</h2>
                <p>{p.description[locale]}</p>
                <div className={styles.pied}>
                  <span className={styles.prix}>{prix}</span>
                  <Link href="/contact" className={styles.bouton}>{p.price === 'quote' ? t('services.devis') : t('boutique.prevenir')}</Link>
                </div>
              </article>
            );
          })}
        </div>
        <Rayon signe="E11C" css={css} titre={t('boutique.musique')} mot={t('signes.E11C')} />
        <div className={styles.grille}>
          {sorties.map((x, i) => {
            const [nom, ...reste] = x.split(' - ');
            return (
              <article key={x} className={styles.carte}>
                <div className={styles.ref}>M.{String(i + 1).padStart(2, '0')}</div>
                <h2>{nom}</h2>
                <p>{reste.join(' - ')}</p>
                <div className={styles.pied}><span className={styles.prix}>{t('boutique.aVenir')}</span></div>
              </article>
            );
          })}
        </div>
      </>
    );
  }

  // logiciels : le catalogue réel du site
  const kinds = { webapp: 'webapps', firmware: 'firmwares', desktop: 'desktop' } as const;
  return (
    <>
      <p className={styles.texte}>{s('subtitle')}</p>
      <div className={styles.grille}>
        {softwaresCatalog.map((x, i) => (
          <article key={x.id} className={styles.carte}>
            <div className={styles.ref}>L.{String(i + 1).padStart(2, '0')} · {s(`sections.${kinds[x.kind]}`)}</div>
            <h2>{x.name[locale]}</h2>
            <p>{x.description[locale]}</p>
            {x.kind === 'webapp' && <div className={styles.pied}><a href={x.url} target="_blank" rel="noreferrer" className={styles.bouton}>{s('cards.openApp')}</a></div>}
            {x.kind === 'desktop' && <div className={styles.pied}><span className={styles.prix}>{s(`desktopStatus.${x.status}`)}</span></div>}
          </article>
        ))}
      </div>
    </>
  );
}

function Rayon({ signe, titre, css, mot }: { signe: string; titre: string; css: string; mot: string }) {
  return (
    <div className={styles.rayon}>
      <Glyphe signe={signe} couleur={css} />
      <h2>{titre}</h2>
      <span>{mot}</span>
    </div>
  );
}

function Liste({ titre, items }: { titre: string; items: string[][] }) {
  return (
    <section className={styles.liste}>
      <h2 className={styles.etiquette}>{titre}</h2>
      <dl>{items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </section>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return <div className={styles.tags}>{tags.map((x) => <span key={x}>{x}</span>)}</div>;
}
