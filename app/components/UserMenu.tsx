'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './Header.module.css';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations('auth');

  if (status === 'loading' || !session) return null;

  return (
    <>
      <Link href="/profile" className={styles.cadreLien}>
        {t('profile')}
      </Link>
      <button type="button" onClick={() => signOut()} className={styles.cadreLien}>
        {t('logout')}
      </button>
    </>
  );
}
