import { cookies } from "next/headers";

const AUTH_COOKIE = "datum_auth";
const AUTH_VALUE = "authenticated";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);
  return authCookie?.value === AUTH_VALUE;
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE;
}

export function getAuthCookieValue(): string {
  return AUTH_VALUE;
}
