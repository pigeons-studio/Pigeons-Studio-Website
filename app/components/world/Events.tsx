'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import type { EventPublic } from '@/lib/events';
import { isEventScene } from '@/lib/event-scenes';
import Scene from './Scene';

type Locale = 'fr' | 'en';

const COPY = {
  fr: {
    vide: 'Aucun rendez-vous pour l’instant.',
    hors: 'Les inscriptions ne sont pas encore branchées.',
    places: (rest: number, total: number) => `${rest} ${rest === 1 ? 'restante' : 'restantes'} / ${total}`,
    retour: '◂ events',
    retourEvent: '◂ event',
    invitation: 'lien d’invitation',
    nom: 'nom',
    email: 'email',
    nomManque: 'Indique ton nom.',
    emailManque: 'Indique un email valide.',
    envoyer: 's’inscrire',
    envoi: 'envoi…',
    inscrit: 'inscrit',
    desinscrire: 'se désinscrire',
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
    invitation: 'invitation link',
    nom: 'name',
    email: 'email',
    nomManque: 'Enter your name.',
    emailManque: 'Enter a valid email.',
    envoyer: 'register',
    envoi: 'sending…',
    inscrit: 'registered',
    desinscrire: 'unregister',
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

function Periode({ debut, fin, locale }: { debut: string; fin: string; locale: Locale }) {
  return (
    <div className="ex-code">
      <span>{quand(debut, locale)}</span>
      <span aria-hidden="true">—</span>
      <span>{quand(fin, locale)}</span>
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
  const { data: session, status: sessionEtat } = useSession();
  const emailCompte = session?.user?.email ?? '';
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
  const [inscrit, setInscrit] = useState(false);
  const [vu, setVu] = useState(false);
  const [moiPret, setMoiPret] = useState(false);
  const debut = useRef(Date.now());
  const ficheVue = useRef<string | undefined>(undefined);
  if (ficheVue.current !== fiche) {
    ficheVue.current = fiche;
    setFicheEtat(fiche ? 'charge' : 'vide');
    setEvent(null);
    setMsg('');
    setEtape(invite ? 'form' : 'fiche');
    setManqueChamp('');
    setVu(false);
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

  useEffect(() => {
    if (!fiche || sessionEtat === 'loading') { setMoiPret(!fiche); return; }
    if (!emailCompte) { setInscrit(false); setMoiPret(true); return; }
    let stop = false;
    setMoiPret(false);
    fetch(`/api/events/${fiche}/me`)
      .then(async (r) => {
        if (stop) return;
        const d = await r.json().catch(() => ({}));
        setInscrit(Boolean(d.registered));
        setMoiPret(true);
      })
      .catch(() => { if (!stop) { setInscrit(false); setMoiPret(true); } });
    return () => { stop = true; };
  }, [fiche, sessionEtat, emailCompte]);

  const rafraichir = async () => {
    if (!fiche) return;
    const again = await fetch(`/api/events/${fiche}?locale=${locale}`);
    if (again.ok) setEvent((await again.json()).event ?? null);
    chargerListe().catch(() => {});
  };

  const inscrire = async (e: FormEvent) => {
    e.preventDefault();
    if (!fiche || !event) return;
    if (!nom.trim()) { setManqueChamp('nom'); setMsg(t.nomManque); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setManqueChamp('email'); setMsg(t.emailManque); return; }
    if (!humain || piege.trim()) { setManqueChamp(''); setMsg(t.bot); return; }
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
          antiBot: { sliderValue: curseur, honeypot: piege, elapsedMs: Date.now() - debut.current },
        }),
      });
      const d = await r.json();
      if (r.ok || d.error === 'already') {
        setVu(true);
        setMsg('');
        setNom('');
        setEmail('');
        setEtape('fiche');
        rafraichir().catch(() => {});
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

  const inscrireCompte = async () => {
    if (!fiche) return;
    setCharge(true);
    setMsg('');
    try {
      const r = await fetch(`/api/events/${fiche}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compte: true, locale, invite: invite || undefined }),
      });
      const d = await r.json();
      if (r.ok || d.error === 'already') {
        setInscrit(true);
        setMsg('');
        rafraichir().catch(() => {});
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

  const desinscrire = async () => {
    if (!fiche) return;
    setCharge(true);
    setMsg('');
    try {
      const r = await fetch(`/api/events/${fiche}/register`, { method: 'DELETE' });
      if (r.ok) {
        setInscrit(false);
        rafraichir().catch(() => {});
      } else setMsg(t.erreur);
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
          invite && emailCompte ? (
            <div className="fenetre-invitation">
              <p className="invitation">{t.invitation}</p>
              <header>
                <Periode debut={event.startsAt} fin={event.endsAt} locale={locale} />
                <h2>{event.title}</h2>
                <p className="ex-sous">{event.place}</p>
              </header>
              {!moiPret ? null : inscrit ? (
                <div className="ligne-inscrit">
                  <span className="marque"><i />{t.inscrit}</span>
                  <button type="button" className="btn doux" onClick={desinscrire} disabled={charge}>{t.desinscrire}</button>
                </div>
              ) : (
                <button type="button" className="btn plein" onClick={inscrireCompte} disabled={charge}>{charge ? t.envoi : t.envoyer}</button>
              )}
              {msg && <p className={msg === t.ok ? 'ok' : 'erreur'}>{msg}</p>}
            </div>
          ) : (
          <form noValidate onSubmit={inscrire}>
            {invite && <p className="invitation">{t.invitation}</p>}
            <header>
              <Periode debut={event.startsAt} fin={event.endsAt} locale={locale} />
              <h2>{event.title}</h2>
              <p className="ex-sous">{event.place}</p>
            </header>
            <label>{t.nom}<input className={manqueChamp === 'nom' ? 'manque' : undefined} value={nom} onChange={(e) => { setNom(e.target.value); setManqueChamp(''); }} maxLength={120} autoComplete="name" /></label>
            <label>{t.email}<input className={manqueChamp === 'email' ? 'manque' : undefined} type="email" inputMode="email" value={email} onChange={(e) => { setEmail(e.target.value); setManqueChamp(''); }} autoComplete="email" /></label>
            <div className="piege" aria-hidden="true">
              <label htmlFor="invite-site">Website</label>
              <input id="invite-site" name="website" type="text" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} />
            </div>
            <label htmlFor="invite-robot" className="robot">{t.robot} *
              <span>{t.glisser}</span>
              <input id="invite-robot" type="range" min={0} max={100} value={curseur} onChange={(e) => setCurseur(Number(e.target.value))} />
              <span className={humain ? 'ok' : undefined}>{humain ? t.pret : t.progres(curseur)}</span>
            </label>
            <button type="submit" className="btn plein" disabled={charge || !humain}>{charge ? t.envoi : t.envoyer}</button>
            {msg && <p className={msg === t.ok ? 'ok' : 'erreur'}>{msg}</p>}
          </form>
          )
        ) : (
          <>
            <header>
              <Periode debut={event.startsAt} fin={event.endsAt} locale={locale} />
              <h2>{event.title}</h2>
              {event.subtitle && <p className="ex-sous">{event.subtitle}</p>}
              <p className="ex-sous">{event.place}</p>
              <p className="ex-places">{t.places(event.remaining, event.capacity)}</p>
            </header>
            {event.scene && isEventScene(event.scene) && (
              <figure className="ex-scene">
                <Scene id={event.scene} css={css} locale={locale} />
              </figure>
            )}
            {event.imageUrl && <img className="ex-image" src={event.imageUrl} alt={event.title} />}
            {event.tags.length > 0 && <div className="tags">{event.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
            <div className="md"><ReactMarkdown rehypePlugins={[rehypeSanitize]}>{event.description}</ReactMarkdown></div>
            {!moiPret ? null : emailCompte && inscrit ? (
              <div className="ligne-inscrit">
                <span className="marque"><i />{t.inscrit}</span>
                <button type="button" className="btn doux" onClick={desinscrire} disabled={charge}>{t.desinscrire}</button>
              </div>
            ) : vu ? (
              <div className="ligne-inscrit">
                <span className="marque"><i />{t.inscrit}</span>
                <button type="button" className="btn doux" onClick={() => { setMsg(''); setEtape('form'); }}>{t.envoyer}</button>
              </div>
            ) : event.remaining > 0 || invite ? (
              emailCompte ? (
                <button type="button" className="btn plein" onClick={inscrireCompte} disabled={charge}>{charge ? t.envoi : t.envoyer}</button>
              ) : (
                <button type="button" className="btn plein" onClick={() => { setMsg(''); setEtape('form'); }}>{t.envoyer}</button>
              )
            ) : (
              <p className="vide">{t.full}</p>
            )}
            {etape === 'fiche' && msg && <p className={msg === t.ok ? 'ok' : 'erreur'}>{msg}</p>}
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
