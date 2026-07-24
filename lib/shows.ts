import { ensureSchema, getSql } from "./db";

export type Show = {
  id: number;
  date: string; // "YYYY-MM-DD"
  venue: string;
  city: string;
  ticketUrl: string | null;
  soldOut: boolean;
};

type ShowRow = {
  id: number;
  date: string | Date;
  venue: string;
  city: string;
  ticket_url: string | null;
  sold_out: boolean;
};

function toShow(r: ShowRow): Show {
  // Neon returns DATE as a string, but normalise defensively so callers always
  // get a plain "YYYY-MM-DD" regardless of driver behaviour.
  const date =
    r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10);
  return {
    id: r.id,
    date,
    venue: r.venue,
    city: r.city,
    ticketUrl: r.ticket_url,
    soldOut: r.sold_out,
  };
}

/**
 * Today in ISO form, compared as a plain date string.
 *
 * Deliberately NOT using a timestamp comparison: a show on the 14th should stay
 * listed all day on the 14th, in whatever timezone the visitor is in, rather
 * than disappearing at midnight UTC while the band is still on stage.
 */
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Upcoming shows, soonest first. Past dates fall off on their own. */
export async function getUpcomingShows(): Promise<Show[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensureSchema();
    const rows = (await sql`
      SELECT id, date, venue, city, ticket_url, sold_out
      FROM shows
      WHERE date >= ${todayISO()}
      ORDER BY date ASC
    `) as ShowRow[];
    return rows.map(toShow);
  } catch {
    // A database hiccup should never take the whole site down — the band's
    // homepage still needs to render.
    return [];
  }
}

/** Every show including past ones, newest first. Admin view only. */
export async function getAllShows(): Promise<Show[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema();
  const rows = (await sql`
    SELECT id, date, venue, city, ticket_url, sold_out
    FROM shows
    ORDER BY date DESC
  `) as ShowRow[];
  return rows.map(toShow);
}

export async function createShow(input: {
  date: string;
  venue: string;
  city: string;
  ticketUrl: string | null;
  soldOut: boolean;
}) {
  const sql = getSql();
  if (!sql) throw new Error("No database configured");
  await ensureSchema();
  await sql`
    INSERT INTO shows (date, venue, city, ticket_url, sold_out)
    VALUES (${input.date}, ${input.venue}, ${input.city}, ${input.ticketUrl}, ${input.soldOut})
  `;
}

export async function updateShow(
  id: number,
  input: {
    date: string;
    venue: string;
    city: string;
    ticketUrl: string | null;
    soldOut: boolean;
  },
) {
  const sql = getSql();
  if (!sql) throw new Error("No database configured");
  await ensureSchema();
  await sql`
    UPDATE shows
    SET date = ${input.date},
        venue = ${input.venue},
        city = ${input.city},
        ticket_url = ${input.ticketUrl},
        sold_out = ${input.soldOut}
    WHERE id = ${id}
  `;
}

export async function deleteShow(id: number) {
  const sql = getSql();
  if (!sql) throw new Error("No database configured");
  await ensureSchema();
  await sql`DELETE FROM shows WHERE id = ${id}`;
}

/** "Sat, Sep 14" — the compact form used in the banner. */
export function formatShowDateShort(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** "September 14, 2026" — the long form used in the shows list. */
export function formatShowDateLong(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
