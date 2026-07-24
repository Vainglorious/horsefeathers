import { band, photos } from "@/lib/content";
import { getUpcomingShows } from "@/lib/shows";
import NextShowBanner from "@/components/NextShowBanner";
import Shows from "@/components/Shows";

// Always read fresh from the database — a date added in /admin should show up
// on the homepage immediately, not after the next deploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const shows = await getUpcomingShows();
  const nextShow = shows[0] ?? null;

  return (
    <>
      <NextShowBanner show={nextShow} />

      <main className="flex-1">
        {/* ---------- Hero ---------- */}
        <section
          className="relative flex min-h-[100svh] flex-col items-center justify-between bg-ink px-5 py-16 text-center"
          style={
            photos.hero
              ? {
                  backgroundImage: `url(${photos.hero})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {/* Stand-in until real photography lands: a soft light pool that
              mimics the blown-out sky in the existing hero shot. */}
          {!photos.hero && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_18%,#4a4a4a,transparent_75%)]"
            />
          )}

          <h1 className="relative font-display text-[clamp(2.25rem,8.5vw,5.5rem)] text-rust tracked-wide">
            {band.name}
          </h1>

          <p className="relative max-w-2xl font-body text-[clamp(1.125rem,3vw,1.75rem)] text-paper tracked">
            {band.albumLine}
          </p>

          {/* Spacer keeps the album line optically centred between the name and
              the bottom edge, matching the live site's proportions. */}
          <div aria-hidden="true" />
        </section>

        {/* ---------- Shows (new — hidden until dates exist) ---------- */}
        <Shows shows={shows} />

        {/* ---------- About ---------- */}
        <section
          id="about"
          className="relative flex min-h-[70svh] items-center justify-center bg-ink-soft px-5 py-24"
          style={
            photos.about
              ? {
                  backgroundImage: `url(${photos.about})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <p className="relative mx-auto max-w-2xl bg-ink/75 p-8 text-center font-body text-lg leading-relaxed text-paper tracked sm:text-xl sm:leading-relaxed">
            {band.about}
          </p>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="bg-ink px-5 py-24 text-center sm:py-32">
          <h2 className="font-display text-3xl text-rust tracked-wide sm:text-4xl">
            Contact
          </h2>
          <p className="mt-8 font-display text-xl text-paper tracked sm:text-2xl">
            {band.name}
          </p>
          <p className="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-paper-dim tracked">
            For bookings and all other inquiries contact us at{" "}
            <a
              href={`mailto:${band.email}`}
              className="text-rust underline underline-offset-4 transition-colors hover:text-rust-bright"
            >
              {band.email}
            </a>{" "}
            or at{" "}
            <a
              href={`tel:${band.phoneHref}`}
              className="text-rust underline underline-offset-4 transition-colors hover:text-rust-bright"
            >
              {band.phone}
            </a>
          </p>
        </section>
      </main>

      <footer className="border-t border-ink-line bg-ink px-5 py-8 text-center">
        <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-paper-dim">
          © {new Date().getFullYear()} {band.name}
        </p>
      </footer>
    </>
  );
}
