'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import AdminShell from './AdminShell';
import EventApercu, { apercuDepuisDetail, type Apercu } from './EventApercu';
import styles from './admin.module.css';

type Row = {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  startsAt: string;
  place: string;
  capacity: number;
  taken: number;
  hidden: boolean;
};

function quand(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  }).format(new Date(iso));
}

function Actions({
  fr,
  row,
  onVoir,
  onBasculer,
  onSupprimer,
}: {
  fr: boolean;
  row: Row;
  onVoir: (row: Row) => void;
  onBasculer: (row: Row) => void;
  onSupprimer: (row: Row) => void;
}) {
  const bouton = useRef<HTMLButtonElement>(null);
  const [ouvert, setOuvert] = useState(false);
  const [place, setPlace] = useState({ top: 0, right: 0, auDessus: false });

  const ouvrir = () => {
    const rect = bouton.current?.getBoundingClientRect();
    if (!rect) return;
    const auDessus = rect.bottom + 160 > window.innerHeight;
    setPlace({ top: auDessus ? rect.top - 8 : rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right), auDessus });
    setOuvert(true);
  };

  const menu = ouvert && typeof document !== 'undefined' ? createPortal(
    <>
      <div className={styles.menuFond} onClick={() => setOuvert(false)} />
      <div className={styles.menuListe} role="menu" style={place.auDessus ? { bottom: window.innerHeight - place.top, right: place.right } : { top: place.top, right: place.right }}>
        <button type="button" className={styles.btn} role="menuitem" onClick={() => { setOuvert(false); onVoir(row); }}>{fr ? 'aperçu' : 'preview'}</button>
        <button type="button" className={styles.btn} role="menuitem" onClick={() => { setOuvert(false); onBasculer(row); }}>{row.hidden ? (fr ? 'afficher' : 'show') : (fr ? 'masquer' : 'hide')}</button>
        <button type="button" className={styles.btn} role="menuitem" onClick={() => { setOuvert(false); onSupprimer(row); }}>{fr ? 'supprimer' : 'delete'}</button>
      </div>
    </>,
    document.body,
  ) : null;

  return (
    <div className={styles.ligneActions}>
      <Link className={styles.btn} href={`/admin/events/${row.id}`}>{fr ? 'éditer' : 'edit'}</Link>
      <button ref={bouton} type="button" className={styles.btn} aria-expanded={ouvert} aria-label={fr ? 'plus d’actions' : 'more actions'} onClick={() => (ouvert ? setOuvert(false) : ouvrir())}>...</button>
      {menu}
    </div>
  );
}

export default function AdminEvents() {
  const locale = useLocale();
  const fr = locale === 'fr';
  const [rows, setRows] = useState<Row[] | null>(null);
  const [cible, setCible] = useState<Row | null>(null);
  const [apercu, setApercu] = useState<Apercu | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const charger = useCallback(async () => {
    const r = await fetch('/api/admin/events');
    if (!r.ok) { setMsg(fr ? 'Base indisponible.' : 'Database unavailable.'); return; }
    const data = await r.json();
    setRows(data.events ?? []);
  }, [fr]);

  useEffect(() => {
    charger().catch(() => setMsg('error'));
  }, [charger]);

  const confirmer = async () => {
    if (!cible || busy) return;
    setBusy(true);
    setMsg('');
    const r = await fetch(`/api/admin/events/${cible.id}`, { method: 'DELETE' });
    setBusy(false);
    setCible(null);
    if (!r.ok) {
      setMsg(fr ? 'L’event n’a pas été supprimé.' : 'Could not delete the event.');
      return;
    }
    charger().catch(() => setMsg('error'));
  };

  const voir = async (row: Row) => {
    setMsg('');
    const r = await fetch(`/api/admin/events/${row.id}`);
    if (!r.ok) { setMsg(fr ? 'L’aperçu n’a pas pu s’ouvrir.' : 'Could not open the preview.'); return; }
    setApercu(apercuDepuisDetail(await r.json(), locale));
  };

  const basculer = async (row: Row) => {
    setMsg('');
    const hidden = !row.hidden;
    const r = await fetch(`/api/admin/events/${row.id}/visibility`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden }),
    });
    if (!r.ok) { setMsg(fr ? 'Le changement n’a pas abouti.' : 'Could not update visibility.'); return; }
    setRows((liste) => liste && liste.map((item) => (item.id === row.id ? { ...item, hidden } : item)));
  };

  const titre = cible ? (fr ? cible.titleFr : cible.titleEn) : '';
  const fenetre = cible && typeof document !== 'undefined' ? createPortal(
    <div className={styles.voile} role="dialog" aria-modal="true" aria-labelledby="confirm-titre" onClick={() => { if (!busy) setCible(null); }}>
      <div className={styles.fenetre} onClick={(e) => e.stopPropagation()}>
        <p id="confirm-titre">{fr ? 'Supprimer cet event' : 'Delete this event'}</p>
        <p>{titre}</p>
        <p>{fr
          ? 'Les inscriptions et les liens d’invitation de cet event seront aussi supprimés.'
          : 'Registrations and invitation links for this event will be deleted too.'}</p>
        <div className={styles.choix}>
          <button type="button" className={styles.btn} disabled={busy} onClick={confirmer}>{fr ? 'supprimer' : 'delete'}</button>
          <button type="button" className={styles.btn} disabled={busy} onClick={() => setCible(null)}>{fr ? 'annuler' : 'cancel'}</button>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <AdminShell
      large
      titre="Events"
      retour={{ href: '/profile', label: fr ? '◂ profil' : '◂ profile' }}
      extra={<p><Link className={styles.lien} href="/admin/users">{fr ? 'comptes' : 'accounts'}</Link></p>}
    >
      {fenetre}
      <EventApercu apercu={apercu} locale={locale} onClose={() => setApercu(null)} />
      <div className={styles.choix}>
        <Link className={styles.btn} href="/admin/events/new">{fr ? 'créer un event' : 'create event'}</Link>
        <Link className={styles.btn} href="/admin/animations">{fr ? 'animations' : 'animations'}</Link>
      </div>
      {msg && <p>{msg}</p>}
      {rows && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{fr ? 'Titre' : 'Title'}</th>
                <th>Slug</th>
                <th>{fr ? 'Lieu' : 'Place'}</th>
                <th>{fr ? 'Début' : 'Start'}</th>
                <th>{fr ? 'Places' : 'Seats'}</th>
                <th className={styles.action} />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={6} className={styles.muet}>{fr ? 'Aucun event.' : 'No events yet.'}</td></tr>
              ) : rows.map((row) => (
                <tr key={row.id} className={row.hidden ? styles.masque : undefined}>
                  <td>{fr ? row.titleFr : row.titleEn}{row.hidden ? (fr ? ' · masqué' : ' · hidden') : ''}</td>
                  <td>{row.slug}</td>
                  <td>{row.place}</td>
                  <td>{quand(row.startsAt, locale)}</td>
                  <td>{row.taken}/{row.capacity}</td>
                  <td className={styles.action}>
                    <Actions fr={fr} row={row} onVoir={voir} onBasculer={basculer} onSupprimer={setCible} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
