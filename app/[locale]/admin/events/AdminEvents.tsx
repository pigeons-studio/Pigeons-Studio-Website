'use client';

import { useEffect, useState } from 'react';
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
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/events')
      .then(async (r) => {
        if (!r.ok) { setMsg(fr ? 'Base indisponible.' : 'Database unavailable.'); return; }
        const data = await r.json();
        setRows(data.events ?? []);
      })
      .catch(() => setMsg('error'));
  }, [fr]);

  return (
    <AdminShell
      large
      titre="Events"
      retour={{ href: '/profile', label: fr ? '◂ profil' : '◂ profile' }}
      extra={<p><Link className={styles.lien} href="/admin/users">{fr ? 'comptes' : 'accounts'}</Link></p>}
    >
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
                    <Link className={styles.btn} href={`/admin/events/${row.id}`}>{fr ? 'éditer' : 'edit'}</Link>
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
