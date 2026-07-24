/**
 * SITE CONTENT — everything except tour dates.
 *
 * Tour dates deliberately do NOT live here: they're in the database so the band
 * can add them from /admin without touching code. See lib/shows.ts.
 *
 * Copy below is taken verbatim from the current thehorsefeathers.com.
 */

export const band = {
  name: "The Horsefeathers",
  albumLine: "Look for our debut album, Dogtooth, this Fall.",
  about:
    "The Horsefeathers is a band formed after a drive through the country, swapping songs in a parking lot, and listening to John Denver on the way home. The Horsefeathers seek to express contemporary sound and song while staying close to the traditions of rock, country, and blues music.",
  email: "thehorsefeathersband@gmail.com",
  phone: "(204) 918-5650",
  phoneHref: "+12049185650",
} as const;

/**
 * Background photography. Drop files in /public and point these at them.
 * Until then each section falls back to a dark gradient — the layout holds up
 * either way, so the site is never broken while we wait on assets.
 *
 * TODO: get the original full-res photos from the band (the Wix ones are
 * compressed and we shouldn't hotlink them).
 */
export const photos = {
  hero: null as string | null, // e.g. "/hero.jpg" — the portrait
  about: null as string | null, // e.g. "/about.jpg" — the boots-on-gravel shot
} as const;

export const site = {
  // TODO: swap to the real domain once Vercel DNS is pointed.
  url: "https://thehorsefeathers.com",
  description:
    "The Horsefeathers — rock, country, and blues. Debut album Dogtooth out this Fall.",
} as const;
