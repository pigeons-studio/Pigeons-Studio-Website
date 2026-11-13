// En thème clair, le mail reste noir et crème (#f2f0ea), l'or seulement sur la marque et le bouton.
// Gmail en mode sombre assombrit le crème. On retire le dégradé qui figeait le fond
// sans le texte, et on annule l'inversion avec deux fusions, actives seulement dans Gmail.
// Le blanc forcé ne s'applique qu'en mode sombre.
const TETE = `<head>
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  u + .body .gmail-blend-screen { background:#000; mix-blend-mode:screen; }
  u + .body .gmail-blend-difference { background:#000; mix-blend-mode:difference; }
  @media (prefers-color-scheme: dark) {
    .fond, .fond td { background:#000 !important; background-color:#000 !important; }
    .encre { color:#ffffff !important; }
    .or { color:#ffb545 !important; border-color:#ffb545 !important; }
  }
  [data-ogsc] .encre { color:#ffffff !important; }
  [data-ogsb] .fond, [data-ogsb] .fond td { background:#000 !important; background-color:#000 !important; }
</style>
</head>`;

export function mailNoir(contenu: string) {
  return `<!DOCTYPE html><html>${TETE}<body class="fond" style="margin:0;background:#000;">
<div class="gmail-blend-screen"><div class="gmail-blend-difference">
${contenu}
</div></div>
</body></html>`;
}
