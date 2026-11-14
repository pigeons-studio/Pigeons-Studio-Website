ALTER TABLE users ADD COLUMN IF NOT EXISTS cgu_accepted_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS cgu_version text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_email text;
ALTER TABLE email_tokens ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'signup';
