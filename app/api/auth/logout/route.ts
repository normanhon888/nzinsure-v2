import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  decodeSessionToken,
  getClearSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/platform/auth/session";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await decodeSessionToken(token);
  console.info("auth.logout", { authenticated: Boolean(session) });

  const response = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );

  response.cookies.set({
    ...getClearSessionCookieOptions(),
    value: "",
  });

  return response;
}
