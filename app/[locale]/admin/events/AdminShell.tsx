'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Header from '@/app/components/Header';
import LoginModal from '@/app/components/LoginModal';
import styles from './admin.module.css';

export default function AdminShell({
  retour,
  titre,
  large,
  extra,
  children,
}: {
  retour: { href: string; label: string };
  titre: string;
  large?: boolean;
  extra?: ReactNode;
  children: ReactNode;
}) {
  const { status } = useSession();
  const fr = useLocale() === 'fr';
  const [login, setLogin] = useState(false);
  const [interdit, setInterdit] = useState(false);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') {
      setPret(false);
      return;
    }
    fetch('/api/admin/me')
      .then((r) => {
        setInterdit(!r.ok);
        setPret(r.ok);
      })
      .catch(() => setInterdit(true));
  }, [status]);

  return (
    <div className={`page ${styles.page}`}>
      <Header />
      <main className={large ? `${styles.main} ${styles.large}` : styles.main}>
        <Link className={styles.retour} href={retour.href}>{retour.label}</Link>
        <h1>{titre}</h1>
        {extra}
        {status !== 'authenticated' ? (
          <button type="button" className={styles.btn} onClick={() => setLogin(true)}>
            {fr ? 'Connexion admin' : 'Admin login'}
          </button>
        ) : interdit ? (
          <p>{fr ? 'Ce compte n’est pas l’admin.' : 'This account is not the admin.'}</p>
        ) : pret ? children : null}
      </main>
      <LoginModal isOpen={login} onClose={() => setLogin(false)} />
    </div>
  );
}
