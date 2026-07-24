import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Deliberately minimal auth: one shared password for the whole band.
 *
 * No user accounts, no email verification, no password resets — the band shares
 * one secret in their group chat. If that ever stops being enough, swapping in
 * a real auth provider means touching only this file.
 *
 * The cookie holds an HMAC of the password rather than the password itself, so
 * a stolen cookie can't be read back into the plaintext secret.
 */

const COOKIE = "hf_admin";

function secret() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return pw;
}

function tokenFor(pw: string) {
  return createHmac("sha256", pw).update("horsefeathers-admin-v1").digest("hex");
}

/** Constant-time compare so we don't leak the password a character at a time. */
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string) {
  const pw = secret();
  if (!pw) return false;
  return safeEqual(input, pw);
}

export async function signIn(password: string) {
  if (!checkPassword(password)) return false;
  const jar = await cookies();
  jar.set(COOKIE, tokenFor(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days — the band shouldn't re-login weekly
  });
  return true;
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isSignedIn() {
  const pw = secret();
  if (!pw) return false;
  const jar = await cookies();
  const got = jar.get(COOKIE)?.value;
  if (!got) return false;
  return safeEqual(got, tokenFor(pw));
}

/** True when ADMIN_PASSWORD hasn't been configured yet. */
export function isConfigured() {
  return secret() !== null;
}
