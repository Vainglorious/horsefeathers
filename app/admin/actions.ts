"use server";

import { revalidatePath } from "next/cache";
import { isSignedIn, signIn, signOut } from "@/lib/auth";
import { createShow, deleteShow, updateShow } from "@/lib/shows";

export type ActionState = { error?: string; ok?: string };

/** Pull the shared show fields out of a form and sanity-check them. */
function readShowForm(formData: FormData) {
  const date = String(formData.get("date") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const rawUrl = String(formData.get("ticketUrl") ?? "").trim();
  const rawMap = String(formData.get("mapUrl") ?? "").trim();
  const soldOut = formData.get("soldOut") === "on";

  if (!date) return { error: "Pick a date." as const };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Date must be YYYY-MM-DD." as const };
  if (!venue) return { error: "Add a venue." as const };
  if (!city) return { error: "Add a city." as const };

  // Accept a bare "example.com/tickets" and make it a real link, so nobody has
  // to remember to type https:// on a phone keyboard.
  let ticketUrl: string | null = null;
  if (rawUrl) {
    ticketUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    try {
      new URL(ticketUrl);
    } catch {
      return { error: "That ticket link doesn't look like a valid URL." as const };
    }
  }

  let mapUrl: string | null = null;
  if (rawMap) {
    mapUrl = /^https?:\/\//i.test(rawMap) ? rawMap : `https://${rawMap}`;
    try {
      new URL(mapUrl);
    } catch {
      return { error: "That map link doesn't look like a valid URL." as const };
    }
  }

  return { value: { date, venue, city, ticketUrl, mapUrl, soldOut } };
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter the password." };
  const ok = await signIn(password);
  if (!ok) return { error: "Wrong password." };
  revalidatePath("/admin");
  return { ok: "Signed in." };
}

export async function logoutAction() {
  await signOut();
  revalidatePath("/admin");
}

export async function addShowAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isSignedIn())) return { error: "Session expired — sign in again." };

  const parsed = readShowForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    await createShow(parsed.value);
  } catch (e) {
    return { error: `Couldn't save: ${(e as Error).message}` };
  }

  // The homepage banner reads from the same table, so refresh it too.
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: `Added ${parsed.value.venue}.` };
}

export async function updateShowAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isSignedIn())) return { error: "Session expired — sign in again." };

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Bad show id." };

  const parsed = readShowForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    await updateShow(id, parsed.value);
  } catch (e) {
    return { error: `Couldn't update: ${(e as Error).message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: "Saved." };
}

export async function deleteShowAction(formData: FormData) {
  if (!(await isSignedIn())) return;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deleteShow(id);
  revalidatePath("/admin");
  revalidatePath("/");
}
