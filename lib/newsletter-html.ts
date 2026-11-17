import { echap } from '@/lib/html';

export type LangueLettre = 'fr' | 'en';

const IDENTITE = 'PUNK HAZARD, SAS, 27 rue de Chinon, 94110 Arcueil, France.';

function urlSure(escaped: string) {
  const brut = escaped
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  if (!/^https?:\/\//i.test(brut)) return null;
  if (/[\s<>"']/.test(brut)) return null;
  return escaped;
}

function inline(raw: string) {
  let texte = echap(raw);
  texte = texte.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (tout, alt: string, url: string) => {
    const sur = urlSure(url);
    if (!sur) return tout;
    return `<img src="${sur}" alt="${alt}" width="432" style="max-width:100%;height:auto;display:block;margin:16px 0;border:0;">`;
  });
  texte = texte.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (tout, label: string, url: string) => {
    const sur = urlSure(url);
    if (!sur) return tout;
    return `<a href="${sur}" style="color:#ffb545;text-decoration:underline;">${label}</a>`;
  });
  texte = texte.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  texte = texte.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return texte;
}

export function renduMarkdown(markdown: string) {
  const lignes = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocs: string[] = [];
  let i = 0;
  while (i < lignes.length) {
    const ligne = lignes[i];
    if (!ligne.trim()) {
      i += 1;
      continue;
    }
    const titre = /^(#{1,3})\s+(.+)$/.exec(ligne);
    if (titre) {
      const taille = titre[1].length === 1 ? '20px' : titre[1].length === 2 ? '16px' : '14px';
      blocs.push(`<p style="margin:0 0 12px;font-size:${taille};letter-spacing:.08em;text-transform:uppercase;color:#f2f0ea;">${inline(titre[2])}</p>`);
      i += 1;
      continue;
    }
    if (/^[-*]\s+/.test(ligne)) {
      const items: string[] = [];
      while (i < lignes.length && /^[-*]\s+/.test(lignes[i])) {
        items.push(`<li style="margin:0 0 6px;">${inline(lignes[i].replace(/^[-*]\s+/, ''))}</li>`);
        i += 1;
      }
      blocs.push(`<ul style="margin:0 0 16px;padding-left:18px;color:#f2f0ea;">${items.join('')}</ul>`);
      continue;
    }
    const paragraphe: string[] = [];
    while (i < lignes.length && lignes[i].trim() && !/^(#{1,3})\s+/.test(lignes[i]) && !/^[-*]\s+/.test(lignes[i])) {
      paragraphe.push(inline(lignes[i]));
      i += 1;
    }
    blocs.push(`<p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#f2f0ea;">${paragraphe.join('<br>')}</p>`);
  }
  return blocs.join('');
}

export function lettreHtml(opts: {
  locale: LangueLettre;
  apercu: string;
  corps: string;
  lienDesinscription: string;
}) {
  const fr = opts.locale === 'fr';
  const pourquoi = fr
    ? 'Vous recevez ce message parce que vous vous êtes inscrit à la newsletter Pigeons Studio.'
    : 'You are receiving this message because you subscribed to the Pigeons Studio newsletter.';
  const bouton = fr ? 'Se désinscrire' : 'Unsubscribe';
  const corps = renduMarkdown(opts.corps);
  const lien = echap(opts.lienDesinscription);
  return `<!DOCTYPE html><html><body style="margin:0;background:#000;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${echap(opts.apercu)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;max-width:480px;">
<tr><td bgcolor="#000000" style="background:#000000;padding:32px 24px;font-family:ui-monospace,'IBM Plex Mono',Menlo,Consolas,monospace;color:#f2f0ea;">
<p style="margin:0 0 24px;letter-spacing:.18em;font-size:12px;color:#ffb545;">PIGEONS//STUDIO</p>
${corps}
<p style="margin:24px 0 8px;padding-top:16px;border-top:1px solid #2c2b29;font-size:11px;line-height:1.5;color:#f2f0ea;">${pourquoi}</p>
<p style="margin:0 0 12px;font-size:11px;line-height:1.5;color:#f2f0ea;">${IDENTITE}</p>
<a href="${lien}" style="display:inline-block;padding:10px 16px;border:1px solid #ffb545;color:#ffb545;text-decoration:none;letter-spacing:.12em;text-transform:uppercase;font-size:11px;">${bouton}</a>
<p style="margin:12px 0 0;font-size:11px;line-height:1.4;color:#f2f0ea;word-break:break-all;">${lien}</p>
</td></tr></table>
</td></tr></table>
</body></html>`;
}

export function lettreTexte(opts: {
  locale: LangueLettre;
  corps: string;
  lienDesinscription: string;
}) {
  const fr = opts.locale === 'fr';
  const pourquoi = fr
    ? 'Vous recevez ce message parce que vous vous êtes inscrit à la newsletter Pigeons Studio.'
    : 'You are receiving this message because you subscribed to the Pigeons Studio newsletter.';
  const bouton = fr ? 'Se désinscrire' : 'Unsubscribe';
  return `${opts.corps.trim()}\n\n${pourquoi}\n${IDENTITE}\n${bouton} : ${opts.lienDesinscription}`;
}
