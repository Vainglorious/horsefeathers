import { formatShowDateLong, type Show } from "@/lib/shows";

/**
 * The full run of upcoming dates.
 *
 * Hidden entirely when nothing is booked, so the page reads exactly like the
 * current site until the band actually has shows to announce.
 */
export default function Shows({ shows }: { shows: Show[] }) {
  if (shows.length === 0) return null;

  return (
    <section id="shows" className="bg-ink px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-3xl text-rust tracked-wide sm:text-4xl">
          Shows
        </h2>

        <ul className="mt-14 divide-y divide-ink-line border-y border-ink-line">
          {shows.map((show) => (
            <li
              key={show.id}
              className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="min-w-0">
                <p className="font-body text-lg text-paper tracked sm:text-xl">
                  {formatShowDateLong(show.date)}
                </p>
                <p className="mt-1 font-body text-base text-paper-dim tracked">
                  {show.venue} · {show.city}
                </p>
              </div>

              {show.soldOut ? (
                <span className="shrink-0 font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-paper-dim">
                  Sold out
                </span>
              ) : show.ticketUrl ? (
                <a
                  href={show.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 border border-rust px-6 py-2.5 text-center font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-rust transition-colors hover:bg-rust hover:text-ink"
                >
                  Tickets
                </a>
              ) : (
                <span className="shrink-0 font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-paper-dim">
                  At the door
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
