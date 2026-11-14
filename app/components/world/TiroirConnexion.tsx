'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Link } from '@/i18n/routing';
import { poserCookieCgu } from '@/lib/cgu';

const LIB = {
  fr: { bonjour: 'connecté·e', profil: 'mon profil', deconnexion: 'déconnexion', fermer: 'fermer' },
  en: { bonjour: 'signed in', profil: 'my profile', deconnexion: 'log out', fermer: 'close' },
};

type Props = {
  inscription: boolean;
  basculer: (v: boolean) => void;
  fermer: () => void;
};

export default function TiroirConnexion({ inscription, basculer, fermer }: Props) {
  const t = useTranslations('auth');
  const tr = useTranslations('auth.register');
  const locale = useLocale() === 'en' ? 'en' : 'fr';
  const tc = useTranslations('contact');
  const lib = LIB[locale];
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [nom, setNom] = useState('');
  const [msg, setMsg] = useState('');
  const [charge, setCharge] = useState(false);
  const [curseur, setCurseur] = useState(0);
  const [piege, setPiege] = useState('');
  const [cgu, setCgu] = useState(false);
  const debut = useRef(Date.now());
  const humain = curseur >= 100;

  if (session) {
    return (
      <>
        <div className="etiquette">{t('login').toUpperCase()}</div>
        <p>{lib.bonjour} · {session.user?.name || session.user?.email}</p>
        <div className="ligne">
          <Link href="/profile" className="btn doux" onClick={fermer}>{lib.profil}</Link>
          <button type="button" className="btn doux" onClick={() => signOut()}>{lib.deconnexion}</button>
        </div>
        <button type="button" className="btn doux" onClick={fermer}>{lib.fermer}</button>
      </>
    );
  }

  const envoyer = async (e: FormEvent) => {
    e.preventDefault(); setMsg(''); setCharge(true);
    try {
      if (inscription) {
        if (!humain || piege.trim()) { setMsg(tc('form.humanCheckError')); return; }
        if (!cgu) { setMsg(tr('cguRequired')); return; }
        const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: mdp, name: nom, locale, acceptCgu: true, antiBot: { sliderValue: curseur, honeypot: piege, elapsedMs: Date.now() - debut.current } }) });
        const d = await r.json();
        const erreurs: Record<string, string> = {
          emailExists: tr('emailExists'),
          invalidEmail: tr('invalidEmail'),
          passwordTooShort: tr('passwordTooShort'),
          allFieldsRequired: tr('allFieldsRequired'),
          antiBot: tc('form.humanCheckError'),
          cgu: tr('cguRequired'),
          rate: tr('rate'),
        };
        if (!r.ok) setMsg(erreurs[d.error] || t('error'));
        else { setMsg(tr('success')); setCurseur(0); debut.current = Date.now(); }
      } else {
        const r = await signIn('credentials', { email, password: mdp, redirect: false });
        if (r?.error === 'EMAIL_NOT_VERIFIED') setMsg(t('emailNotVerified'));
        else if (r?.error === 'RATE_LIMIT') setMsg(t('rateLimit'));
        else if (r?.error) setMsg(t('invalidCredentials'));
        else fermer();
      }
    } catch { setMsg(t('error')); } finally { setCharge(false); setMdp(''); }
  };

  return (
    <>
      <div className="etiquette">{(inscription ? tr('title') : t('login')).toUpperCase()}</div>
      <form onSubmit={envoyer}>
        {inscription && <label htmlFor="compte-nom">{t('name')}<input id="compte-nom" type="text" autoComplete="name" value={nom} onChange={(e) => setNom(e.target.value)} required /></label>}
        <label htmlFor="compte-email">{t('email')}<input id="compte-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label htmlFor="compte-mdp">{t('password')}<input id="compte-mdp" type="password" autoComplete={inscription ? 'new-password' : 'current-password'} minLength={inscription ? 8 : undefined} value={mdp} onChange={(e) => setMdp(e.target.value)} required /></label>
        {inscription && (
          <>
            <div className="piege" aria-hidden="true"><label htmlFor="compte-site">Website</label><input id="compte-site" name="website" type="text" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} /></div>
            <label htmlFor="compte-robot" className="robot">{tc('form.humanCheckLabel')} *
              <span className="note">{tc('form.humanCheckHint')}</span>
              <input id="compte-robot" type="range" min={0} max={100} value={curseur} onChange={(e) => setCurseur(Number(e.target.value))} />
              <span className={humain ? 'ok' : 'note'}>{humain ? tc('form.humanCheckReady') : tc('form.humanCheckProgress', { value: curseur })}</span>
            </label>
            <div className="cgu-ligne">
              <label className="cgu">
                <input type="checkbox" aria-label={`${tr('acceptCgu')} ${tr('cguLink')}`} checked={cgu} onChange={(e) => setCgu(e.target.checked)} />
                <span className="case" aria-hidden="true" />
                <span>{tr('acceptCgu')}</span>
              </label>
              <Link href="/cgu">{tr('cguLink')}</Link>
            </div>
          </>
        )}
        <button type="submit" className="btn plein" disabled={charge || (inscription && (!humain || !cgu))}>{charge ? (inscription ? t('signingUp') : t('signingIn')) : (inscription ? t('signUp') : t('signIn'))}</button>
        {msg && <p className="note">{msg}</p>}
      </form>
      {!inscription && (
        <>
          <div className="cgu-ligne">
            <label className="cgu">
              <input type="checkbox" aria-label={`${tr('acceptCgu')} ${tr('cguLink')}`} checked={cgu} onChange={(e) => setCgu(e.target.checked)} />
              <span className="case" aria-hidden="true" />
              <span>{tr('acceptCgu')}</span>
            </label>
            <Link href="/cgu">{tr('cguLink')}</Link>
          </div>
          <button type="button" className="btn doux" disabled={!cgu} onClick={() => { poserCookieCgu(); signIn('google', { callbackUrl: window.location.href }); }}>{t('signInWithGoogle')}</button>
        </>
      )}
      <div className="ligne">
        <button type="button" className="lien" onClick={() => basculer(!inscription)}>{inscription ? `${t('alreadyHaveAccount')} ${t('signIn')}` : `${t('noAccount')} ${t('signUp')}`}</button>
      </div>
      <button type="button" className="btn doux" onClick={fermer}>{lib.fermer}</button>
    </>
  );
}
