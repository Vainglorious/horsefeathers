import { formatShowDateLong, type Show } from "@/lib/shows";

/**
 * Thin strip pinned above the hero announcing the next gig, phrased as a
 * sentence: "Playing August 11, 2026 in Calgary at Tool Shed Brewing Company".
 *
 * Renders nothing when no shows are booked — an empty strip would be noise on
 * a site whose main job right now is announcing the album.
 */
export default function NextShowBanner({ show }: { show: Show | null }) {
  if (!show) return null;

  const venue = show.mapUrl ? (
    <a
      href={show.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-black/35 underline-offset-4 transition-colors hover:decoration-black"
    >
      {show.venue}
    </a>
  ) : (
    show.venue
  );

  return (
    <div className="relative z-20 bg-rust text-ink">
      <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center">
        <p className="font-body text-base leading-snug tracked sm:text-lg">
          Playing {formatShowDateLong(show.date)} in {show.city} at {venue}
          {show.soldOut && " — sold out"}
        </p>

        {show.ticketUrl && !show.soldOut && (
          <a
            href={show.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Tickets
          </a>
        )}
      </div>
    </div>
  );
}
