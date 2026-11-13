'use client';

import { useEffect, useRef } from 'react';
import './orca.css';

type Locale = 'fr' | 'en';

// une scène qui tourne en direct, à la place d'une vidéo
export default function Scene({ id, css, locale }: { id: string; css: string; locale: Locale }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let stop = () => {};
    let annule = false;
    import('./scenes').then(({ lancerScene }) => { if (!annule && ref.current) stop = lancerScene(ref.current, id, css, locale); });
    return () => { annule = true; stop(); };
  }, [id, css, locale]);
  return <canvas ref={ref} aria-hidden="true" />;
}
