'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import AdminShell from './AdminShell';
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

export default function AdminEvents() {
  const locale = useLocale();
  const fr = locale === 'fr';
  const [rows, setRows] = useState<Row[] | null>(null);
  const [cible, setCible] = useState<Row | null>(null);
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

  const titre = cible ? (fr ? cible.titleFr : cible.titleEn) : '';
  const fenetre = cible && typeof document !== 'undefined' ? createPortal(
    <div className={styles.voile} role="dialog" aria-modal="true" aria-labelledby="confirm-titre">
      <div className={styles.fenetre}>
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
      <Link className={styles.btn} href="/admin/events/new">{fr ? 'créer un event' : 'create event'}</Link>
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
                <tr key={row.id}>
                  <td>{fr ? row.titleFr : row.titleEn}</td>
                  <td>{row.slug}</td>
                  <td>{row.place}</td>
                  <td>{quand(row.startsAt, locale)}</td>
                  <td>{row.taken}/{row.capacity}</td>
                  <td className={styles.action}>
                    <div className={styles.choix}>
                      <Link className={styles.btn} href={`/admin/events/${row.id}`}>{fr ? 'éditer' : 'edit'}</Link>
                      <button type="button" className={styles.btn} onClick={() => setCible(row)}>{fr ? 'supprimer' : 'delete'}</button>
                    </div>
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
