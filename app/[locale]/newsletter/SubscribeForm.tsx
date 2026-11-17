'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './page.module.css';
import legal from '../legal/page.module.css';

export default function SubscribeForm() {
  const t = useTranslations('newsletter');
  const locale = useLocale() === 'en' ? 'en' : 'fr';
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState('');
  const [etat, setEtat] = useState<'idle' | 'loading' | 'sent' | 'already' | 'error'>('idle');
  const [erreur, setErreur] = useState('');

  const envoyer = async (event: FormEvent) => {
    event.preventDefault();
    if (!consent) {
      setEtat('error');
      setErreur(t('consentMissing'));
      return;
    }
    setEtat('loading');
    setErreur('');
    try {
      const reponse = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale, consent, company }),
      });
      const data = await reponse.json().catch(() => ({}));
      if (!reponse.ok) {
        setEtat('error');
        setErreur(data.error === 'rate' ? t('rate') : data.error === 'invalid' ? t('invalid') : t('error'));
        return;
      }
      setEtat(data.status === 'already' ? 'already' : 'sent');
    } catch {
      setEtat('error');
      setErreur(t('error'));
    }
  };

  return (
    <div className={legal.container}>
      <div className={legal.header}>
        <h1 className={legal.title}>{t('title')}</h1>
      </div>
      <div className={legal.content}>
        <p>{t('intro')}</p>
        {etat === 'sent' ? <p>{t('sent')}</p> : etat === 'already' ? <p>{t('already')}</p> : (
          <form className={styles.form} onSubmit={envoyer}>
            <label className={styles.piege} aria-hidden="true">
              Company
              <input tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} />
            </label>
            <label>
              {t('email')}
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className={styles.consent}>
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>{t('consent')}</span>
            </label>
            <p className={styles.note}>
              {t('privacy')} <Link href="/privacy">{t('privacyLink')}</Link>
            </p>
            <button type="submit" disabled={etat === 'loading'}>{etat === 'loading' ? t('sending') : t('submit')}</button>
            {etat === 'error' && <p>{erreur}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
