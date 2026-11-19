import type { EventPublic } from '@/lib/events';

/*
 * Retours d'événements passés.
 * Ces fiches ne passent pas par la base : ce sont des comptes rendus (texte, vidéo),
 * sans inscription. Elles s'affichent dans Events après les rendez-vous à venir.
 */

type Locale = 'fr' | 'en';

type Report = {
  slug: string;
  startsAt: string;
  endsAt: string;
  place: string;
  imageUrl: string;
  posterUrl: string;
  videoUrl: Record<Locale, string>;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  dateLabel: Record<Locale, string>;
  tags: Record<Locale, string[]>;
  description: Record<Locale, string>;
};

const REPORTS: Report[] = [
  {
    slug: 'acousmonium-kennedy-2026',
    startsAt: '2026-11-14T18:00:00+01:00',
    endsAt: '2026-11-14T22:00:00+01:00',
    place: 'Bâtiment Kennedy, Paris',
    imageUrl: '/events/acousmonium-kennedy-poster.jpg',
    posterUrl: '/events/acousmonium-kennedy-poster.jpg',
    videoUrl: {
      fr: '/events/acousmonium-kennedy-fr.mp4',
      en: '/events/acousmonium-kennedy-en.mp4',
    },
    title: {
      fr: 'ACOUSMONIUM // EN MOUVEMENT',
      en: 'ACOUSMONIUM // IN MOTION',
    },
    subtitle: {
      fr: 'Retour sur notre performance avec Mateo Garcia Audio',
      en: 'Looking back at our performance with Mateo Garcia Audio',
    },
    dateLabel: {
      fr: 'novembre 2026 · événement passé',
      en: 'November 2026 · past event',
    },
    tags: {
      fr: ['Retour', 'Performance', 'Acousmonium', 'Robotique', 'Son spatialisé'],
      en: ['Report', 'Performance', 'Acousmonium', 'Robotics', 'Spatial sound'],
    },
    description: {
      fr: `Pigeons Studio a joué pendant les trois jours d’écoute organisés par Mateo Garcia Audio au bâtiment Kennedy, à Paris, un bâtiment encore en construction.

Pigeons Studio est attaché à l’idée de mouvement. L’enjeu : activer physiquement les enceintes conçues par Mateo Garcia, et rendre physique le déplacement du son.

**Trois entités en dialogue.** Deux backpacks et Billy, notre robot Unitree Go2, chacun équipé d’un TEAMMATE.POTO. Elles s’écoutaient et se répondaient, et Koo Des (NSDOS) dialoguait avec elles.

- **Backpack 01** — OP-XY, OP-1 field, TP-7, TX-6, TEAMMATE.POTO
- **Backpack 02** — deux OP-1 field, TP-7, TX-6, TEAMMATE.POTO
- **Billy** — Unitree Go2 : TP-7, TX-6, TEAMMATE.POTO

**Trois points de diffusion.** Koo Des (NSDOS) portait et déplaçait les backpacks d’un point de diffusion à l’autre, Billy le suivait : le son se déplaçait avec eux.

**La vision de Billy.** Billy voit l’espace en 3D : sur son interface Steam Deck, chaque surface touchée par son LiDAR s’écrit en glyphes As-Simt. Il voit les enceintes, il voit Koo. Un dialogue et une chorégraphie entre le robot et le performeur.

**La musique.** Une musique ambiante inspirée du gamelan, née par transfert de timbre à partir de sons enregistrés dans le bâtiment en construction.

- **Avec** — Mateo Garcia Audio (@mateogarcia_audio)
- **Photos** — Thi-Lea (@penal_thi)
- **Pigeons Studio** — Koo Des (NSDOS) · Julien Thomas`,
      en: `Pigeons Studio performed during the three days of listening organised by Mateo Garcia Audio at the Kennedy building in Paris, a building still under construction.

Pigeons Studio is attached to the idea of movement. The aim: physically activating the speakers designed by Mateo Garcia, and making the movement of sound physical.

**Three entities in dialogue.** Two backpacks and Billy, our Unitree Go2 robot, each carrying a TEAMMATE.POTO. They listened and answered each other, and Koo Des (NSDOS) joined the conversation.

- **Backpack 01** — OP-XY, OP-1 field, TP-7, TX-6, TEAMMATE.POTO
- **Backpack 02** — two OP-1 field, TP-7, TX-6, TEAMMATE.POTO
- **Billy** — Unitree Go2: TP-7, TX-6, TEAMMATE.POTO

**Three diffusion points.** Koo Des (NSDOS) carried and moved the backpacks from one diffusion point to another, with Billy following: the sound moved with them.

**Billy’s vision.** Billy sees the space in 3D: on his Steam Deck interface, every surface his LiDAR touches is written in As-Simt glyphs. He sees the speakers, he sees Koo. A dialogue and a choreography between robot and performer.

**The music.** Gamelan-inspired ambient music, born by timbre transfer from sounds recorded in the building under construction.

- **With** — Mateo Garcia Audio (@mateogarcia_audio)
- **Photos** — Thi-Lea (@penal_thi)
- **Pigeons Studio** — Koo Des (NSDOS) · Julien Thomas`,
    },
  },
];

function toPublic(report: Report, locale: Locale): EventPublic {
  return {
    slug: report.slug,
    title: report.title[locale],
    subtitle: report.subtitle[locale],
    description: report.description[locale],
    tags: report.tags[locale],
    startsAt: report.startsAt,
    endsAt: report.endsAt,
    place: report.place,
    imageUrl: report.imageUrl,
    scene: null,
    capacity: 0,
    remaining: 0,
    past: true,
    dateLabel: report.dateLabel[locale],
    videoUrl: report.videoUrl[locale],
    posterUrl: report.posterUrl,
  };
}

export function listReports(locale: Locale) {
  return [...REPORTS]
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt))
    .map((report) => toPublic(report, locale));
}

export function getReport(slug: string, locale: Locale) {
  const report = REPORTS.find((item) => item.slug === slug);
  return report ? toPublic(report, locale) : null;
}
