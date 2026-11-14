'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { poserCookieCgu } from '@/lib/cgu';
import styles from './LoginModal.module.css';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations('auth');
  const tRegister = useTranslations('auth.register');
  const tContact = useTranslations('contact');
  const locale = useLocale();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [slider, setSlider] = useState(0);
  const [honeypot, setHoneypot] = useState('');
  const [acceptCgu, setAcceptCgu] = useState(false);
  const startedAt = useRef(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Réinitialiser les champs quand on change de mode
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setSlider(0);
      setHoneypot('');
      setAcceptCgu(false);
      startedAt.current = Date.now();
      setError('');
      setSuccess('');
    }
  }, [isOpen, isSignUp]);

  if (!isOpen || !mounted) return null;

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error === 'RATE_LIMIT') {
        setError(t('rateLimit'));
      } else if (result?.error === 'EMAIL_NOT_VERIFIED') {
        setError(t('emailNotVerified'));
      } else if (result?.error) {
        setError(t('invalidCredentials'));
      } else {
        onClose();
        setEmail('');
        setPassword('');
      }
    } catch {
      setError(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          locale,
          acceptCgu,
          antiBot: {
            sliderValue: slider,
            honeypot,
            elapsedMs: Date.now() - startedAt.current,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const erreurs: Record<string, string> = {
          emailExists: tRegister('emailExists'),
          invalidEmail: tRegister('invalidEmail'),
          passwordTooShort: tRegister('passwordTooShort'),
          allFieldsRequired: tRegister('allFieldsRequired'),
          antiBot: tContact('form.humanCheckError'),
          cgu: tRegister('cguRequired'),
          rate: tRegister('rate'),
        };
        setError(erreurs[data.error] || t('error'));
      } else {
        setSuccess(tRegister('success'));
        // Basculer vers le mode connexion après 2 secondes
        setTimeout(() => {
          setIsSignUp(false);
          setSuccess('');
        }, 2000);
      }
    } catch {
      setError(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!acceptCgu) return;
    poserCookieCgu();
    signIn('google', { callbackUrl: window.location.href });
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className={styles.title}>
          {isSignUp ? tRegister('title') : t('login')}
        </h2>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className={styles.form}>
          {isSignUp && (
            <div className={styles.field}>
              <label htmlFor="name">{t('name')}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={isSignUp ? 8 : undefined}
            />
            {isSignUp && (
              <span className={styles.helpText}>
                {tRegister('passwordTooShort')}
              </span>
            )}
          </div>

          {isSignUp && (
            <>
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="signup-slider">{tContact('form.humanCheckLabel')}</label>
                <span className={styles.helpText}>{tContact('form.humanCheckHint')}</span>
                <input id="signup-slider" className={styles.slider} type="range" min={0} max={100} value={slider} onChange={(e) => setSlider(Number(e.target.value))} />
                <span className={styles.helpText}>{slider >= 100 ? tContact('form.humanCheckReady') : tContact('form.humanCheckProgress', { value: slider })}</span>
              </div>
              <div className={styles.cguLigne}>
                <label className={styles.notice}>
                  <input type="checkbox" aria-label={`${tRegister('acceptCgu')} ${tRegister('cguLink')}`} checked={acceptCgu} onChange={(e) => setAcceptCgu(e.target.checked)} />
                  <span className={styles.case} aria-hidden="true" />
                  <span>{tRegister('acceptCgu')}</span>
                </label>
                <Link href="/cgu">{tRegister('cguLink')}</Link>
              </div>
            </>
          )}

          <button type="submit" className={styles.submitButton} disabled={isLoading || (isSignUp && (slider < 100 || !acceptCgu))}>
            {isLoading 
              ? (isSignUp ? t('signingUp') : t('signingIn'))
              : (isSignUp ? t('signUp') : t('signIn'))
            }
          </button>
        </form>

        <div className={styles.switchMode}>
          {isSignUp ? (
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={styles.switchButton}
            >
              {t('alreadyHaveAccount')} {t('signIn')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={styles.switchButton}
            >
              {t('noAccount')} {t('signUp')}
            </button>
          )}
        </div>

        {!isSignUp && (
          <div className={styles.googleBlock}>
            <div className={styles.divider}>
              <span>ou</span>
            </div>

            <div className={styles.cguLigne}>
              <label className={styles.notice}>
                <input type="checkbox" aria-label={`${tRegister('acceptCgu')} ${tRegister('cguLink')}`} checked={acceptCgu} onChange={(e) => setAcceptCgu(e.target.checked)} />
                <span className={styles.case} aria-hidden="true" />
                <span>{tRegister('acceptCgu')}</span>
              </label>
              <Link href="/cgu">{tRegister('cguLink')}</Link>
            </div>
            <button onClick={handleGoogleSignIn} className={styles.googleButton} disabled={!acceptCgu}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t('signInWithGoogle')}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
