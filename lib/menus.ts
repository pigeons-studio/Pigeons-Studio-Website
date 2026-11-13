export const FLOORS = ['bio', 'projets', 'services', 'events', 'boutique', 'logiciels'] as const;

export type Floor = (typeof FLOORS)[number];

export function isFloor(value: string): value is Floor {
  return (FLOORS as readonly string[]).includes(value);
}
