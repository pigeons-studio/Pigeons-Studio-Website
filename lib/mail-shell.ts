// Gmail en mode sombre inverse le noir et le crème. Deux modes de fusion,
// actifs seulement dans Gmail (u + .body), annulent cette inversion.
// Apple Mail respecte le bloc prefers-color-scheme.
const TETE = `<head>
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  u + .body .gmail-blend-screen { background:#000; mix-blend-mode:screen; }
  u + .body .gmail-blend-difference { background:#000; mix-blend-mode:difference; }
  @media (prefers-color-scheme: dark) {
    .fond, .fond td { background:#000 !important; background-color:#000 !important; }
    .encre { color:#ffe4a3 !important; }
    .or { color:#ffb545 !important; border-color:#ffb545 !important; }
  }
</style>
</head>`;

export function mailNoir(contenu: string) {
  return `<!DOCTYPE html><html>${TETE}<body class="fond" style="margin:0;background:#000;background-image:linear-gradient(#000,#000);">
<div class="gmail-blend-screen"><div class="gmail-blend-difference">
${contenu}
</div></div>
</body></html>`;
}
