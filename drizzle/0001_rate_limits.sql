CREATE TABLE IF NOT EXISTS rate_limits (
  key text PRIMARY KEY,
  hits integer NOT NULL,
  window_start timestamptz NOT NULL
);
