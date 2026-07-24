import { album, band } from "@/lib/content";

export default function Hero() {
  // Before release: pre-save if we have a link. After: send them to Spotify.
  const cta = album.isOut
    ? album.links.spotify ?? album.links.bandcamp ?? album.links.appleMusic
    : album.links.preSave;
  const ctaLabel = album.isOut ? "Listen now" : "Pre-save the album";

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center px-5 pt-24 pb-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Album flag — the single most important thing on the page right now. */}
        <p className="mb-6 flex items-center gap-3 font-display text-xs uppercase tracking-[0.3em] text-ember">
          <span className="h-px w-8 bg-ember" aria-hidden="true" />
          Debut album · {album.releaseDate}
        </p>

        <h1 className="font-display text-[clamp(3rem,13vw,10rem)] font-700 uppercase leading-[0.85] tracking-tight text-paper">
          The
          <br />
          Horsefeathers
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper-dim sm:text-xl">
          {band.tagline}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          {cta && (
            <a
              href={cta}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-ember px-8 py-4 font-display text-sm font-600 uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ember-bright"
            >
              {ctaLabel}
            </a>
          )}
          <a
            href="#shows"
            className="inline-flex items-center border border-ink-line px-8 py-4 font-display text-sm font-600 uppercase tracking-[0.15em] text-paper transition-colors hover:border-ember hover:text-ember-bright"
          >
            Tour dates
          </a>
        </div>
      </div>

      <a
        href="#music"
        aria-label="Scroll to music"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-paper-dim transition-colors hover:text-ember md:block"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 5v14m0 0l-6-6m6 6l6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
