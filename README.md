# Pigeons Studio — site

Site Next.js de Pigeons Studio (Koo Des × Julien Thomas).

## La page d'accueil : ORCA//GLYPH

L'accueil est un monde en 3D inspiré d'ORCA//GLYPH : six étages empilés, un par rubrique, chacun sous un signe de l'alphabet partagé As-Simt
(bio = *double*, projets = *faire*, services = *donner*, futurs projets = *graine*, boutique = *paume*, logiciels = *signal*).
Chaque étage porte un petit patch Orca qui tourne. La vue flotte sans tourner.

- molette, flèches haut/bas, ou glisser au doigt : traverser les étages
- clic sur un étage ou son glyphe (ou Entrée) : la caméra descend, l'étage passe en page 2D
- en 2D : les glyphes du haut (ou PgUp/PgDn) changent de page sans repasser par la 3D ; « ◂ 3D » ou Échap pour remonter
- chaque page 2D renvoie à la page complète du site (boutique avec panier, logiciels avec le flasheur, contact…)

Code : `app/components/world/` (`engine.ts` pour la 3D three.js, `World.tsx` pour les pages 2D, `glyphes.json` pour les damiers 8×8).
Le contenu vient de `messages/fr.json` et `messages/en.json` (espace `world` pour les textes propres au monde), de `data/products.json` et de `lib/softwares.ts`.
Les films de « futurs projets » sont dans `public/films/`.

## Lancer en local

```bash
pnpm install
pnpm dev
```

Puis http://localhost:3000. Les variables d'environnement sont décrites dans `env.example` (le build a besoin de `RESEND_API_KEY`).
