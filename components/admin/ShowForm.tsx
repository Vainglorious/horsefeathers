"use client";

import { useActionState, useRef } from "react";
import { addShowAction, type ActionState } from "@/app/admin/actions";

const initial: ActionState = {};

const field =
  "mt-1.5 w-full border border-ink-line bg-ink-soft px-3 py-2.5 font-ui text-base text-paper outline-none focus:border-rust";
const label =
  "block font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-paper-dim";

/**
 * Add-a-show form. Kept as one flat column so it works one-handed on a phone,
 * which is where it'll actually get used — backstage, not at a desk.
 */
export default function ShowForm() {
  const [state, action, pending] = useActionState(addShowAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await action(fd);
        formRef.current?.reset();
      }}
      className="space-y-4"
    >
      <div>
        <label className={label} htmlFor="date">
          Date
        </label>
        {/* type=date gives the native picker — no typing on mobile */}
        <input id="date" name="date" type="date" required className={field} />
      </div>

      <div>
        <label className={label} htmlFor="venue">
          Venue
        </label>
        <input
          id="venue"
          name="venue"
          type="text"
          required
          placeholder="The Park Theatre"
          className={field}
        />
      </div>

      <div>
        <label className={label} htmlFor="city">
          City
        </label>
        <input
          id="city"
          name="city"
          type="text"
          required
          placeholder="Winnipeg, MB"
          className={field}
        />
      </div>

      <div>
        <label className={label} htmlFor="ticketUrl">
          Ticket link <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="ticketUrl"
          name="ticketUrl"
          type="text"
          inputMode="url"
          placeholder="eventbrite.com/… — leave blank for door sales"
          className={field}
        />
      </div>

      <div>
        <label className={label} htmlFor="mapUrl">
          Map link <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="mapUrl"
          name="mapUrl"
          type="text"
          inputMode="url"
          placeholder="Google Maps link — makes the venue name clickable"
          className={field}
        />
      </div>

      <label className="flex items-center gap-3 pt-1">
        <input
          name="soldOut"
          type="checkbox"
          className="h-4 w-4 accent-[#c4703a]"
        />
        <span className="font-ui text-sm text-paper">Sold out</span>
      </label>

      {state.error && (
        <p role="alert" className="font-ui text-sm text-rust-bright">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="font-ui text-sm text-paper-dim">
          {state.ok}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-rust px-6 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-rust-bright disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add show"}
      </button>
    </form>
  );
}
