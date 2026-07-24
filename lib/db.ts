import { neon } from "@neondatabase/serverless";

/**
 * Neon connection.
 *
 * DATABASE_URL is injected automatically if you add Neon through the Vercel
 * dashboard (Storage -> Neon). Locally, put it in .env.local.
 *
 * We create the client lazily so that importing this module doesn't blow up at
 * build time when the env var isn't set yet — the site still renders (with an
 * empty show list) before the database is wired up.
 */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

/**
 * Creates the shows table if it doesn't exist.
 *
 * Called before every read/write. It's a single cheap IF NOT EXISTS, and it
 * means there's no separate migration step to forget — the first page load
 * after connecting Neon sets everything up.
 */
export async function ensureSchema() {
  const sql = getSql();
  if (!sql) return false;
  await sql`
    CREATE TABLE IF NOT EXISTS shows (
      id          SERIAL PRIMARY KEY,
      date        DATE NOT NULL,
      venue       TEXT NOT NULL,
      city        TEXT NOT NULL,
      ticket_url  TEXT,
      sold_out    BOOLEAN NOT NULL DEFAULT FALSE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  return true;
}
