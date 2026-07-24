/**
 * ALL SITE CONTENT LIVES HERE.
 *
 * This is the only file the band needs to touch for day-to-day updates —
 * adding a show, swapping a streaming link, changing the album date.
 * No component code required.
 *
 * Anything marked TODO is a placeholder waiting on real info.
 */

export const band = {
  name: "The Horsefeathers",
  tagline: "Rock, country, and blues out of Manitoba.",
  // The origin story, straight from the current site.
  blurb:
    "The Horsefeathers came together after a cross-country drive ended in a parking-lot jam session. We're chasing a contemporary sound while staying close to the traditions of rock, country, and blues.",
  email: "thehorsefeathersband@gmail.com",
  phone: "(204) 918-5650",
  location: "Manitoba, Canada",
} as const;

export const socials = [
  { label: "Instagram", handle: "@thehorsefeathersband", href: "https://www.instagram.com/thehorsefeathersband/" },
  { label: "YouTube", handle: "@TheHorsefeathersBand", href: "https://www.youtube.com/@TheHorsefeathersBand" },
  // TODO: add Spotify / Apple Music / Bandcamp / TikTok once the links exist.
] as const;

/**
 * The debut album.
 * `releaseDate` accepts anything readable — "Fall 2026", "October 3, 2026".
 * Set `isOut` to true on release day and the CTA flips from pre-save to listen.
 */
export const album = {
  title: "Dogtooth",
  releaseDate: "Fall 2026",
  isOut: false,
  // TODO: drop the cover art in /public/dogtooth.jpg and set this to "/dogtooth.jpg"
  cover: null as string | null,
  description:
    "Our debut record. Ten songs written on the road and cut close to the bone.",
  // TODO: real links. Leave null to hide the button entirely.
  links: {
    preSave: null as string | null,
    spotify: null as string | null,
    appleMusic: null as string | null,
    bandcamp: null as string | null,
  },
} as const;

/**
 * Embedded players. Paste the ID only, not the whole URL.
 *   spotifyAlbumId  -> from open.spotify.com/album/<THIS>
 *   youtubeVideoId  -> from youtube.com/watch?v=<THIS>
 * Leave null and that section hides itself.
 */
export const embeds = {
  spotifyAlbumId: null as string | null,
  youtubeVideoId: null as string | null,
};

export type Show = {
  date: string; // ISO: "2026-09-14"
  venue: string;
  city: string;
  ticketUrl: string | null; // null renders as "At the door"
  soldOut?: boolean;
};

/**
 * Upcoming shows. Past dates drop off automatically — no need to delete them.
 * TODO: replace with the real run of dates.
 */
export const shows: Show[] = [
  // {
  //   date: "2026-09-14",
  //   venue: "The Park Theatre",
  //   city: "Winnipeg, MB",
  //   ticketUrl: "https://...",
  // },
];

export type Member = {
  name: string;
  instrument: string;
};

// TODO: confirm the full lineup — Benjamin is the only one we have so far.
export const members: Member[] = [
  { name: "Benjamin Hill", instrument: "Bass" },
];

export const site = {
  // TODO: set to the real domain once Vercel is pointed at it.
  url: "https://thehorsefeathers.com",
  description:
    "Official site of The Horsefeathers — rock, country, and blues out of Manitoba. Debut album Dogtooth out Fall 2026.",
} as const;
