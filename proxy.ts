import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  REQUEST_ROLE_HEADER,
  REQUEST_USER_ID_HEADER,
} from "@/platform/auth/constants";
import {
  decodeSessionToken,
  getFallbackRole,
  SESSION_COOKIE_NAME,
} from "@/platform/auth/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decodeSessionToken(token);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(REQUEST_ROLE_HEADER);
  requestHeaders.delete(REQUEST_USER_ID_HEADER);

  if (session) {
    requestHeaders.set(REQUEST_ROLE_HEADER, session.role);
    requestHeaders.set(REQUEST_USER_ID_HEADER, session.userId);
  } else {
    requestHeaders.set(REQUEST_ROLE_HEADER, getFallbackRole());
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
