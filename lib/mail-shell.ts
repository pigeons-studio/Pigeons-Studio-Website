// Thème clair : rien ici ne change les couleurs écrites dans le mail (noir, crème, or).
// Gmail supprime les styles du <head>. Le mode sombre est donc déclaré dans le <body>,
// et seulement là : fond noir verrouillé, texte blanc, or inchangé.
const SOMBRE = `<style>
  @media (prefers-color-scheme: dark) {
    .fond, .fond td, .fond table { background:#000 !important; background-color:#000 !important; background-image:linear-gradient(#000,#000) !important; }
    .encre, .encre p, a.encre { color:#ffffff !important; }
    .or, a.or { color:#ffb545 !important; border-color:#ffb545 !important; }
  }
  [data-ogsc] .encre, [data-ogsc] .encre p, [data-ogsc] a.encre { color:#ffffff !important; }
  [data-ogsb] .fond, [data-ogsb] .fond td, [data-ogsb] .fond table { background:#000 !important; background-color:#000 !important; background-image:linear-gradient(#000,#000) !important; }
</style>`;

export function mailNoir(contenu: string) {
  return `<!DOCTYPE html><html><head><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"></head><body class="fond" style="margin:0;background:#000;">
${SOMBRE}
${contenu}
</body></html>`;
}
