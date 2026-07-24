import type { Metadata } from "next";
import { isConfigured, isSignedIn } from "@/lib/auth";
import { getAllShows, formatShowDateLong } from "@/lib/shows";
import { getSql } from "@/lib/db";
import { deleteShowAction, logoutAction } from "./actions";
import LoginForm from "@/components/admin/LoginForm";
import ShowForm from "@/components/admin/ShowForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false }, // keep this page out of Google
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-16">
      <h1 className="font-display text-3xl text-rust tracked-wide">Shows</h1>
      <p className="mt-2 font-ui text-sm text-paper-dim">
        Add a date here and it appears on the site straight away.
      </p>
      <div className="mt-10">{children}</div>
    </main>
  );
}

function SetupNotice({ missing }: { missing: string[] }) {
  return (
    <div className="border border-ink-line bg-ink-soft p-6">
      <h2 className="font-ui text-sm font-semibold text-paper">
        Almost there — {missing.length === 1 ? "one thing" : "two things"} left to set up
      </h2>
      <ul className="mt-4 space-y-3 font-ui text-sm text-paper-dim">
        {missing.includes("db") && (
          <li>
            <strong className="text-paper">Database.</strong> In Vercel: Storage → Neon →
            create. It sets <code className="text-rust">DATABASE_URL</code> automatically.
            Locally, put it in <code className="text-rust">.env.local</code>.
          </li>
        )}
        {missing.includes("password") && (
          <li>
            <strong className="text-paper">Admin password.</strong> Set{" "}
            <code className="text-rust">ADMIN_PASSWORD</code> in Vercel → Settings →
            Environment Variables (and in <code className="text-rust">.env.local</code> for
            local use), then redeploy.
          </li>
        )}
      </ul>
    </div>
  );
}

export default async function AdminPage() {
  const missing: string[] = [];
  if (!getSql()) missing.push("db");
  if (!isConfigured()) missing.push("password");

  if (missing.length > 0) {
    return (
      <Shell>
        <SetupNotice missing={missing} />
      </Shell>
    );
  }

  if (!(await isSignedIn())) {
    return (
      <Shell>
        <LoginForm />
      </Shell>
    );
  }

  const shows = await getAllShows();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = shows.filter((s) => s.date >= today);
  const past = shows.filter((s) => s.date < today);

  return (
    <Shell>
      <section>
        <h2 className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-paper-dim">
          Add a show
        </h2>
        <div className="mt-5">
          <ShowForm />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-paper-dim">
          Upcoming ({upcoming.length})
        </h2>

        {upcoming.length === 0 ? (
          <p className="mt-4 font-ui text-sm text-paper-dim">
            Nothing booked yet. The banner stays hidden until you add one.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-ink-line border-y border-ink-line">
            {upcoming.map((show) => (
              <li key={show.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="font-ui text-sm text-paper">
                    {formatShowDateLong(show.date)}
                    {show.soldOut && (
                      <span className="ml-2 text-paper-dim">· sold out</span>
                    )}
                  </p>
                  <p className="truncate font-ui text-sm text-paper-dim">
                    {show.venue} · {show.city}
                  </p>
                </div>
                <form action={deleteShowAction}>
                  <input type="hidden" name="id" value={show.id} />
                  <button
                    type="submit"
                    className="shrink-0 font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-paper-dim transition-colors hover:text-rust-bright"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-14">
          <h2 className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-paper-dim">
            Past ({past.length})
          </h2>
          <p className="mt-2 font-ui text-xs text-paper-dim">
            These drop off the site automatically. Kept here for your records.
          </p>
          <ul className="mt-4 divide-y divide-ink-line border-y border-ink-line">
            {past.map((show) => (
              <li key={show.id} className="flex items-center justify-between gap-4 py-3">
                <p className="truncate font-ui text-sm text-paper-dim">
                  {formatShowDateLong(show.date)} · {show.venue}
                </p>
                <form action={deleteShowAction}>
                  <input type="hidden" name="id" value={show.id} />
                  <button
                    type="submit"
                    className="shrink-0 font-ui text-[11px] uppercase tracking-[0.18em] text-paper-dim transition-colors hover:text-rust-bright"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}

      <form action={logoutAction} className="mt-16">
        <button
          type="submit"
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-paper-dim transition-colors hover:text-rust-bright"
        >
          Sign out
        </button>
      </form>
    </Shell>
  );
}
