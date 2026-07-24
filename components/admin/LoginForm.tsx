"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/admin/actions";

const initial: ActionState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="mx-auto w-full max-w-sm">
      <label
        htmlFor="password"
        className="block font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-paper-dim"
      >
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        className="mt-2 w-full border border-ink-line bg-ink-soft px-4 py-3 font-ui text-base text-paper outline-none focus:border-rust"
      />

      {state.error && (
        <p role="alert" className="mt-3 font-ui text-sm text-rust-bright">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full bg-rust px-6 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-rust-bright disabled:opacity-50"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
