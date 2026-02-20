import { NextResponse } from "next/server";
import { isRole } from "@/platform/roles";
import { buildSessionCookie } from "@/platform/auth/session";

type LoginPayload = {
  uid?: unknown;
  role?: unknown;
};

type LoginAttemptWindow = {
  count: number;
  windowStartMs: number;
};

const LOGIN_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;
const loginAttemptsByIp = new Map<string, LoginAttemptWindow>();

function errorResponse(status: number, error: string) {
  return NextResponse.json(
    { success: false, error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstForwardedIp = forwardedFor.split(",")[0]?.trim();
    if (firstForwardedIp) return firstForwardedIp;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  for (const [entryIp, entry] of loginAttemptsByIp.entries()) {
    if (now - entry.windowStartMs >= LOGIN_RATE_LIMIT_WINDOW_MS) {
      loginAttemptsByIp.delete(entryIp);
    }
  }

  const currentEntry = loginAttemptsByIp.get(ip);
  if (!currentEntry) {
    loginAttemptsByIp.set(ip, { count: 1, windowStartMs: now });
    return false;
  }

  if (now - currentEntry.windowStartMs >= LOGIN_RATE_LIMIT_WINDOW_MS) {
    loginAttemptsByIp.set(ip, { count: 1, windowStartMs: now });
    return false;
  }

  currentEntry.count += 1;
  loginAttemptsByIp.set(ip, currentEntry);
  return currentEntry.count > LOGIN_RATE_LIMIT_MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    console.info("auth.login.failed", {
      reason: "rate_limited",
    });
    return errorResponse(429, "Too many login attempts. Please try again later.");
  }

  let payload: LoginPayload;
  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    console.info("auth.login.failed", {
      reason: "invalid_json",
    });
    return errorResponse(400, "Invalid login payload.");
  }

  if (typeof payload.uid !== "string" || !payload.uid.trim()) {
    console.info("auth.login.failed", {
      reason: "invalid_uid",
    });
    return errorResponse(400, "Invalid uid.");
  }

  if (typeof payload.role !== "string" || !isRole(payload.role)) {
    console.info("auth.login.failed", {
      role_present: typeof payload.role === "string",
      reason: "invalid_role",
    });
    return errorResponse(400, "Invalid role.");
  }

  const uid = payload.uid.trim();
  const response = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  const sessionCookie = await buildSessionCookie({
    userId: uid,
    role: payload.role,
  });
  response.cookies.set(sessionCookie);
  console.info("auth.login.succeeded", { role: payload.role });

  return response;
}
