import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { sealData, unsealData } from "iron-session";

const SESSION_COOKIE_NAME = "cityqlo_admin_session";

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("Server configuration error.");
  }
  return secret;
}

export async function getSession() {
  const cookie = getCookie(SESSION_COOKIE_NAME);
  if (!cookie) return null;

  try {
    const session = await unsealData(cookie, { password: getSessionSecret() });
    return session as { userId: number; username: string };
  } catch (e) {
    return null;
  }
}

export async function setSession(user: { id: number; username: string }) {
  const session = { userId: user.id, username: user.username };
  const sealed = await sealData(session, { password: getSessionSecret() });

  setCookie(SESSION_COOKIE_NAME, sealed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export function clearSession() {
  deleteCookie(SESSION_COOKIE_NAME);
}

export const getAuthUser = createServerFn({ method: "GET" }).handler(async () => {
  return await getSession();
});
