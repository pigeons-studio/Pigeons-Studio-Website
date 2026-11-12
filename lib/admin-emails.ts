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
