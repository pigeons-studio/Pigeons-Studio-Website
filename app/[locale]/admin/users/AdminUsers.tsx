'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Header from '@/app/components/Header';
import LoginModal from '@/app/components/LoginModal';
import styles from '../events/admin.module.css';

type Compte = {
  id: string;
  name: string;
  email: string;
  role: string;
  confirmed: boolean;
  locked: boolean;
};

type Action = 'promote' | 'revoke';

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const fr = locale === 'fr';
  const moi = session?.user?.email?.toLowerCase() ?? '';
  const [login, setLogin] = useState(false);
  const [interdit, setInterdit] = useState(false);
  const [comptes, setComptes] = useState<Compte[] | null>(null);
  const [cible, setCible] = useState<{ compte: Compte; action: Action } | null>(null);
  const [msg, setMsg] = useState('');

  const charger = async () => {
    const r = await fetch('/api/admin/users');
    if (r.status === 403) { setInterdit(true); setComptes(null); return; }
    if (!r.ok) { setMsg(fr ? 'Base indisponible.' : 'Database unavailable.'); return; }
    setInterdit(false);
    const data = await r.json();
    setComptes(data.accounts ?? []);
  };

  useEffect(() => {
    if (status === 'authenticated') charger().catch(() => setMsg('error'));
  }, [status]);

  const confirmer = async () => {
    if (!cible) return;
    setMsg('');
    const r = await fetch(`/api/admin/users/${cible.compte.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: cible.action === 'promote' ? 'admin' : 'user' }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      if (data.error === 'locked') setMsg(fr ? 'Ce compte reste admin.' : 'This account stays admin.');
      else if (data.error === 'self') setMsg(fr ? 'Vous ne pouvez pas retirer votre propre accès.' : 'You can’t revoke your own access.');
      else setMsg(cible.action === 'promote'
        ? (fr ? 'La promotion n’a pas abouti.' : 'Could not promote this account.')
        : (fr ? 'Le retrait n’a pas abouti.' : 'Could not revoke this account.'));
    }
    setCible(null);
    charger().catch(() => {});
  };

  const promouvoir = cible?.action === 'promote';
  const fenetre = cible && typeof document !== 'undefined' ? createPortal(
    <div className={styles.voile} role="dialog" aria-modal="true" aria-labelledby="confirm-titre">
      <div className={styles.fenetre}>
        <p id="confirm-titre">{promouvoir ? (fr ? 'Rendre admin' : 'Make admin') : (fr ? 'Retirer admin' : 'Revoke admin')}</p>
        <p>{cible.compte.name}<br />{cible.compte.email}</p>
        <p>{promouvoir
          ? (fr ? 'Cette personne pourra gérer les events et les comptes.' : 'This person will be able to manage events and accounts.')
          : (fr ? 'Cette personne ne pourra plus gérer les events ni les comptes.' : 'This person will no longer manage events or accounts.')}</p>
        <div className={styles.choix}>
          <button type="button" className={styles.btn} onClick={confirmer}>{fr ? 'confirmer' : 'confirm'}</button>
          <button type="button" className={styles.btn} onClick={() => setCible(null)}>{fr ? 'annuler' : 'cancel'}</button>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <div className={`page ${styles.page}`}>
      <Header />
      <main className={`${styles.main} ${styles.large}`}>
        <Link className={styles.retour} href="/profile">{fr ? '◂ profil' : '◂ profile'}</Link>
        <h1>{fr ? 'Comptes' : 'Accounts'}</h1>
        <p><Link className={styles.lien} href="/admin/events">events</Link></p>
        {status !== 'authenticated' ? (
          <button type="button" className={styles.btn} onClick={() => setLogin(true)}>
            {fr ? 'Connexion admin' : 'Admin login'}
          </button>
        ) : interdit ? (
          <p>{fr ? 'Ce compte n’est pas l’admin.' : 'This account is not the admin.'}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{fr ? 'Nom' : 'Name'}</th>
                  <th>Email</th>
                  <th>{fr ? 'Rôle' : 'Role'}</th>
                  <th>{fr ? 'Statut' : 'Status'}</th>
                  <th className={styles.action} />
                </tr>
              </thead>
              <tbody>
                {(comptes ?? []).map((compte) => {
                  const admin = compte.role === 'admin' || compte.locked;
                  const soi = compte.email.toLowerCase() === moi;
                  return (
                    <tr key={compte.id}>
                      <td>{compte.name}</td>
                      <td>{compte.email}</td>
                      <td>{admin ? 'admin' : (fr ? 'compte' : 'account')}</td>
                      <td>{compte.confirmed ? (fr ? 'confirmé' : 'confirmed') : (fr ? 'en attente' : 'pending')}</td>
                      <td className={styles.action}>
                        {compte.locked || (admin && soi) ? (
                          <span className={styles.muet}>—</span>
                        ) : admin ? (
                          <button type="button" className={styles.btn} onClick={() => setCible({ compte, action: 'revoke' })}>{fr ? 'retirer admin' : 'revoke admin'}</button>
                        ) : (
                          <button type="button" className={styles.btn} onClick={() => setCible({ compte, action: 'promote' })}>{fr ? 'rendre admin' : 'make admin'}</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {msg && <p>{msg}</p>}
      </main>
      {fenetre}
      <LoginModal isOpen={login} onClose={() => setLogin(false)} />
    </div>
  );
}
