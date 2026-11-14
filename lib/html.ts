export function echap(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function uneLigne(value: string, max = 200) {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}
