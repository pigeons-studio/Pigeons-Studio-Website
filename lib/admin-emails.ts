function clean(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, '').toLowerCase() ?? '';
}

export function adminEmails() {
  const raw = `${process.env.ADMIN_EMAIL ?? ''},${process.env.ADMIN_EMAILS ?? ''}`;
  return new Set(raw.split(',').map((part) => clean(part)).filter(Boolean));
}

export function isAdminEmail(email: string) {
  return adminEmails().has(email.toLowerCase());
}

export function orderEmails() {
  const listed = (process.env.ORDER_EMAILS ?? '').split(',').map((part) => clean(part)).filter(Boolean);
  if (listed.length) return listed;
  const admins = [...adminEmails()];
  if (admins.length) return admins;
  const fallback = clean(process.env.RESEND_TO_EMAIL) || 'contact@punkhazard.org';
  return [fallback];
}
