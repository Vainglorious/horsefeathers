import { formatShowDateShort, type Show } from "@/lib/shows";

/**
 * Thin strip pinned above the hero, showing the next upcoming gig.
 *
 * Renders nothing at all when there are no shows booked — no "no upcoming
 * dates" placeholder, because an empty strip would just be visual noise on a
 * site whose whole job right now is announcing the album.
 */
export default function NextShowBanner({ show }: { show: Show | null }) {
  if (!show) return null;

  const label = `${formatShowDateShort(show.date)} · ${show.venue} · ${show.city}`;

  return (
    <div className="relative z-20 bg-rust text-ink">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center">
        <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em]">
          {show.soldOut ? "Next show — sold out" : "Next show"}
        </span>
        <span className="font-body text-base leading-snug tracked">{label}</span>
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
