import { cookies, headers } from "next/headers";
import { isRole, type Role } from "@/platform/roles";
import {
  decodeSessionToken,
  getFallbackRole,
  SESSION_COOKIE_NAME,
} from "@/platform/auth/session";
import type { AuthState } from "@/platform/auth/types";
import {
  REQUEST_ROLE_HEADER,
  REQUEST_USER_ID_HEADER,
} from "@/platform/auth/constants";

export type ServerAuthContext = AuthState;

export async function getServerAuthContext(): Promise<ServerAuthContext> {
  const incomingHeaders = await headers();
  const headerRole = incomingHeaders.get(REQUEST_ROLE_HEADER);
  const headerUserId = incomingHeaders.get(REQUEST_USER_ID_HEADER);

  if (headerRole && isRole(headerRole)) {
    return {
      role: headerRole,
      userId: headerUserId ?? null,
      isAuthenticated: Boolean(headerUserId),
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await decodeSessionToken(token);

  if (!session) {
    return {
      role: getFallbackRole(),
      userId: null,
      isAuthenticated: false,
    };
  }

  return {
    role: session.role,
    userId: session.userId,
    isAuthenticated: true,
  };
}

export async function getServerRole(): Promise<Role> {
  const auth = await getServerAuthContext();
  return auth.role;
}
