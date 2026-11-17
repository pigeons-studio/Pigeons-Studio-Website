'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../../legal/page.module.css';

export default function LeaveForm({ token }: { token: string }) {
  const t = useTranslations('newsletter');
  const [etat, setEtat] = useState<'idle' | 'loading' | 'ok' | 'error'>(token ? 'idle' : 'error');

  const confirmer = async () => {
    setEtat('loading');
    try {
      const reponse = await fetch('/api/newsletter/unsubscribe', {
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
        <h1 className={styles.title}>{t('leaveTitle')}</h1>
      </div>
      <div className={styles.content}>
        {etat === 'ok' ? <p>{t('leaveOk')}</p> : (
          <>
            <p>{token ? t('leaveIntro') : t('leaveMissing')}</p>
            {token && (
              <button type="button" onClick={confirmer} disabled={etat === 'loading'}>
                {etat === 'loading' ? t('leaveWorking') : t('leaveConfirm')}
              </button>
            )}
            {etat === 'error' && token && <p>{t('leaveError')}</p>}
          </>
        )}
      </div>
    </div>
  );
}
