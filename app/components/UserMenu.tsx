'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './Header.module.css';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations('auth');
  const [ouvert, setOuvert] = useState(false);
  const boite = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: MouseEvent) => {
      if (!boite.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener('mousedown', fermer);
    return () => document.removeEventListener('mousedown', fermer);
  }, [ouvert]);

  if (status === 'loading' || !session) return null;

  const nom = session.user?.name?.split(' ')[0] || t('profile');

  return (
    <div className={styles.compte} ref={boite}>
      <button type="button" className={styles.cadreLien} aria-expanded={ouvert} onClick={() => setOuvert((v) => !v)}>
        {nom}
      </button>
      {ouvert && (
        <div className={styles.compteMenu}>
          <Link href="/profile" className={styles.cadreLien} onClick={() => setOuvert(false)}>{t('profile')}</Link>
          <button type="button" className={styles.cadreLien} onClick={() => signOut()}>{t('logout')}</button>
        </div>
      )}
    </div>
  );
}
