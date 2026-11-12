'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import type { EventPublic } from '@/lib/events';

type Locale = 'fr' | 'en';

const COPY = {
  fr: {
    vide: 'Aucun rendez-vous pour l’instant.',
    hors: 'Les inscriptions ne sont pas encore branchées.',
    places: (rest: number, total: number) => `${rest} ${rest === 1 ? 'restante' : 'restantes'} / ${total}`,
    retour: '◂ events',
    retourEvent: '◂ event',
    nom: 'nom',
    email: 'email',
    nomManque: 'Indique ton nom.',
    emailManque: 'Indique un email valide.',
    envoyer: 's’inscrire',
    envoi: 'envoi…',
    ok: 'Inscription enregistrée.',
    full: 'C’est complet.',
    already: 'Cet email est déjà inscrit.',
    invalid: 'Nom ou email invalide.',
    missing: 'Cet event n’existe pas.',
    invite: 'Ce lien d’invitation n’est plus valable.',
    bot: 'Veuillez compléter la vérification anti-robot.',
    antiBot: 'Veuillez compléter la vérification anti-robot.',
    robot: 'Vérification anti-robot',
    glisser: 'Faites glisser le curseur complètement vers la droite pour activer l’envoi.',
    progres: (n: number) => `Progression : ${n}%`,
    pret: 'Vérification validée.',
    erreur: 'L’inscription n’a pas abouti.',
    charge: 'chargement',
  },
  en: {
    vide: 'No dates yet.',
    hors: 'Registration is not connected yet.',
    places: (rest: number, total: number) => `${rest} left / ${total}`,
    retour: '◂ events',
    retourEvent: '◂ event',
    nom: 'name',
    email: 'email',
    nomManque: 'Enter your name.',
    emailManque: 'Enter a valid email.',
    envoyer: 'register',
    envoi: 'sending…',
    ok: 'You’re registered.',
    full: 'This one is full.',
    already: 'This email is already registered.',
    invalid: 'Invalid name or email.',
    missing: 'This event doesn’t exist.',
    invite: 'This invitation link is no longer valid.',
    bot: 'Please complete the anti-bot verification.',
    antiBot: 'Please complete the anti-bot verification.',
    robot: 'Anti-bot verification',
    glisser: 'Slide all the way to the right to unlock sending.',
    progres: (n: number) => `Progress: ${n}%`,
    pret: 'Verification complete.',
    erreur: 'Registration didn’t go through.',
    charge: 'loading',
  },
};

function Chargeur({ label }: { label: string }) {
  return (
    <div className="chargeur" role="status" aria-label={label}>
      <span className="cadre" />
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className="point" style={{ ['--i' as string]: i }} />
      ))}
    </div>
  );
}

function quand(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  }).format(new Date(iso));
}

export default function EventsPanel({
  locale,
  css,
  fiche,
  onFiche,
}: {
  locale: Locale;
  css: string;
  fiche?: string;
  onFiche: (id: string) => void;
}) {
  const t = COPY[locale];
  const invite = useSearchParams().get('invite') ?? '';
  const [events, setEvents] = useState<EventPublic[] | null>(null);
  const [ready, setReady] = useState(true);
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [ficheEtat, setFicheEtat] = useState<'vide' | 'charge' | 'ok' | 'absent'>('vide');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [charge, setCharge] = useState(false);
  const [curseur, setCurseur] = useState(0);
  const [piege, setPiege] = useState('');
  const [etape, setEtape] = useState<'fiche' | 'form'>('fiche');
  const [manqueChamp, setManqueChamp] = useState<'nom' | 'email' | ''>('');
  const debut = useRef(Date.now());
  const ficheVue = useRef<string | undefined>(undefined);
  if (ficheVue.current !== fiche) {
    ficheVue.current = fiche;
    setFicheEtat(fiche ? 'charge' : 'vide');
    setEvent(null);
    setMsg('');
    setEtape('fiche');
    setManqueChamp('');
  }
  const humain = curseur >= 100;

  useEffect(() => {
    debut.current = Date.now();
    setCurseur(0);
    setPiege('');
  }, [fiche, invite]);

  const chargerListe = useCallback(async () => {
    const r = await fetch(`/api/events?locale=${locale}`);
    const d = await r.json();
    setEvents(d.events ?? []);
    setReady(d.ready !== false);
  }, [locale]);

  useEffect(() => {
    let stop = false;
    chargerListe().catch(() => { if (!stop) setEvents([]); });
    return () => { stop = true; };
  }, [chargerListe]);

  useEffect(() => {
    if (!fiche) { setEvent(null); setMsg(''); setFicheEtat('vide'); return; }
    let stop = false;
    setFicheEtat('charge');
    setEvent(null);
    fetch(`/api/events/${fiche}?locale=${locale}`)
      .then(async (r) => {
        if (stop) return;
        if (!r.ok) { setEvent(null); setFicheEtat('absent'); return; }
        const d = await r.json();
        if (!d.event) { setEvent(null); setFicheEtat('absent'); return; }
        setEvent(d.event);
        setFicheEtat('ok');
      })
      .catch(() => { if (!stop) { setEvent(null); setFicheEtat('absent'); } });
    return () => { stop = true; };
  }, [fiche, locale]);

  const inscrire = async (e: FormEvent) => {
    e.preventDefault();
    if (!fiche || !event) return;
    if (!nom.trim()) { setManqueChamp('nom'); setMsg(t.nomManque); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setManqueChamp('email'); setMsg(t.emailManque); return; }
    if (invite && (!humain || piege.trim())) { setManqueChamp(''); setMsg(t.bot); return; }
    setManqueChamp('');
    setCharge(true);
    setMsg('');
    try {
      const r = await fetch(`/api/events/${fiche}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nom,
          email,
          locale,
          invite: invite || undefined,
          antiBot: invite ? { sliderValue: curseur, honeypot: piege, elapsedMs: Date.now() - debut.current } : undefined,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        setMsg(t.ok);
        setNom('');
        setEmail('');
        const again = await fetch(`/api/events/${fiche}?locale=${locale}`);
        if (again.ok) setEvent((await again.json()).event ?? null);
        chargerListe().catch(() => {});
      } else {
        const code = d.error as keyof typeof t;
        setMsg(typeof t[code] === 'string' ? (t[code] as string) : t.erreur);
      }
    } catch {
      setMsg(t.erreur);
    } finally {
      setCharge(false);
    }
  };

  if (fiche) {
    return (
      <article className="events fiche" style={{ ['--c' as string]: css }}>
        <button type="button" className="btn doux" onClick={() => etape === 'form' ? setEtape('fiche') : onFiche('')}>{etape === 'form' ? t.retourEvent : t.retour}</button>
        {ficheEtat === 'absent' ? (
          <p className="vide">{ready ? t.missing : t.hors}</p>
        ) : ficheEtat !== 'ok' || !event ? (
          <Chargeur label={t.charge} />
        ) : etape === 'form' ? (
          <form noValidate onSubmit={inscrire}>
            <header>
              <div className="ex-code">{quand(event.startsAt, locale)} — {quand(event.endsAt, locale)}</div>
              <h2>{event.title}</h2>
              <p className="ex-sous">{event.place}</p>
            </header>
            <label>{t.nom}<input className={manqueChamp === 'nom' ? 'manque' : undefined} value={nom} onChange={(e) => { setNom(e.target.value); setManqueChamp(''); }} maxLength={120} autoComplete="name" /></label>
            <label>{t.email}<input className={manqueChamp === 'email' ? 'manque' : undefined} type="email" inputMode="email" value={email} onChange={(e) => { setEmail(e.target.value); setManqueChamp(''); }} autoComplete="email" /></label>
            {invite && (
              <>
                <div className="piege" aria-hidden="true">
                  <label htmlFor="invite-site">Website</label>
                  <input id="invite-site" name="website" type="text" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} />
                </div>
                <label htmlFor="invite-robot" className="robot">{t.robot} *
                  <span>{t.glisser}</span>
                  <input id="invite-robot" type="range" min={0} max={100} value={curseur} onChange={(e) => setCurseur(Number(e.target.value))} />
                  <span className={humain ? 'ok' : undefined}>{humain ? t.pret : t.progres(curseur)}</span>
                </label>
              </>
            )}
            <button type="submit" className="btn plein" disabled={charge || (Boolean(invite) && !humain)}>{charge ? t.envoi : t.envoyer}</button>
            {msg && <p className={msg === t.ok ? 'ok' : 'erreur'}>{msg}</p>}
          </form>
        ) : (
          <>
            <header>
              <div className="ex-code">{quand(event.startsAt, locale)} — {quand(event.endsAt, locale)}</div>
              <h2>{event.title}</h2>
              <p className="ex-sous">{event.place}</p>
              <p className="ex-places">{t.places(event.remaining, event.capacity)}</p>
            </header>
            {event.imageUrl && <img className="ex-image" src={event.imageUrl} alt={event.title} />}
            <p>{event.description}</p>
            {event.remaining > 0 || invite ? (
              <button type="button" className="btn plein" onClick={() => { setMsg(''); setEtape('form'); }}>{t.envoyer}</button>
            ) : (
              <p className="vide">{t.full}</p>
            )}
          </>
        )}
      </article>
    );
  }

  return (
    <div className="events" style={{ ['--c' as string]: css }}>
      {events === null ? <Chargeur label={t.charge} /> : events.length === 0 ? (
        <p className="vide">{ready ? t.vide : t.hors}</p>
      ) : (
        <div className="ex-liste" role="list">
          {events.map((item) => (
            <button key={item.slug} type="button" onClick={() => onFiche(item.slug)}>
              <span className="ex-code">{quand(item.startsAt, locale)}</span>
              <span className="ex-corps">
                {item.imageUrl && <img className="ex-visuel" src={item.imageUrl} alt="" />}
                <span>
                  <span className="ex-nom">{item.title}</span>
                  <span className="ex-lieu">{item.place}</span>
                </span>
              </span>
              <span className="ex-places">{t.places(item.remaining, item.capacity)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
