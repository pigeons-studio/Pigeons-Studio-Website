'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import AdminShell from '../events/AdminShell';
import styles from '../events/admin.module.css';

type Lettre = {
  id: string;
  subjectFr: string;
  subjectEn: string;
  status: string;
  createdAt: string;
  sentAt: string | null;
};

type Comptes = {
  subscribed: number;
  pending: number;
  unsubscribed: number;
  fr: number;
  en: number;
};

export default function AdminNewsletter() {
  const fr = useLocale() === 'fr';
  const [lettres, setLettres] = useState<Lettre[] | null>(null);
  const [comptes, setComptes] = useState<Comptes | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then((r) => r.json())
      .then((data) => {
        if (!data.lettres) { setMsg(fr ? 'Base indisponible.' : 'Database unavailable.'); return; }
        setLettres(data.lettres);
        setComptes(data.comptes);
      })
      .catch(() => setMsg(fr ? 'Base indisponible.' : 'Database unavailable.'));
  }, [fr]);

  const titreDe = (lettre: Lettre) => lettre.subjectFr || lettre.subjectEn || (fr ? 'sans sujet' : 'no subject');
  const etat = (status: string) => {
    if (status === 'sent') return fr ? 'envoyée' : 'sent';
    if (status === 'sending') return fr ? 'en cours' : 'sending';
    return fr ? 'brouillon' : 'draft';
  };

  return (
    <AdminShell retour={{ href: '/profile', label: fr ? '◂ profil' : '◂ profile' }} titre="newsletter">
      {comptes && (
        <p className={styles.muet}>
          {fr
            ? `${comptes.subscribed} inscrits (${comptes.fr} fr, ${comptes.en} en), ${comptes.pending} en attente, ${comptes.unsubscribed} désinscrits.`
            : `${comptes.subscribed} subscribed (${comptes.fr} fr, ${comptes.en} en), ${comptes.pending} pending, ${comptes.unsubscribed} unsubscribed.`}
        </p>
      )}
      <Link className={styles.btn} href="/admin/newsletter/new">{fr ? 'nouvelle lettre' : 'new letter'}</Link>
      {msg && <p>{msg}</p>}
      {lettres && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{fr ? 'sujet' : 'subject'}</th>
                <th>{fr ? 'état' : 'status'}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lettres.map((lettre) => (
                <tr key={lettre.id}>
                  <td data-label={fr ? 'sujet' : 'subject'}>{titreDe(lettre)}</td>
                  <td data-label={fr ? 'état' : 'status'}>{etat(lettre.status)}</td>
                  <td className={styles.action}>
                    <Link className={styles.btn} href={`/admin/newsletter/${lettre.id}`}>{fr ? 'éditer' : 'edit'}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!lettres.length && <p className={styles.muet}>{fr ? 'Aucune lettre.' : 'No letters.'}</p>}
        </div>
      )}
    </AdminShell>
  );
}
