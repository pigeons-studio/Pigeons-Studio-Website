import { readFileSync } from 'fs';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const cut = trimmed.indexOf('=');
  if (cut < 0) continue;
  const key = trimmed.slice(0, cut);
  let value = trimmed.slice(cut + 1);
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
  if (!process.env[key]) process.env[key] = value;
}

async function main() {
  const { seedWorkshopMicros } = await import('../lib/events');
  const result = await seedWorkshopMicros();
  console.log(result.status);
  if (result.status === 'unavailable') process.exit(1);
}

main();
