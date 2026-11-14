'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../../legal/page.module.css';

export default function LeaveForm({ token }: { token: string }) {
  const t = useTranslations('leave');
  const [etat, setEtat] = useState<'idle' | 'loading' | 'ok' | 'error'>(token ? 'idle' : 'error');

  const confirmer = async () => {
    setEtat('loading');
    try {
      const reponse = await fetch('/api/events/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      setEtat(reponse.ok ? 'ok' : 'error');
    } catch {
      setEtat('error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('title')}</h1>
      </div>
      <div className={styles.content}>
        {etat === 'ok' ? <p>{t('ok')}</p> : (
          <>
            <p>{token ? t('intro') : t('missing')}</p>
            {token && (
              <button type="button" onClick={confirmer} disabled={etat === 'loading'}>
                {etat === 'loading' ? t('working') : t('confirm')}
              </button>
            )}
            {etat === 'error' && token && <p>{t('error')}</p>}
          </>
        )}
      </div>
    </div>
  );
}
