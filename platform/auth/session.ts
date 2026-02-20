import { DEFAULT_ROLE, isRole, type Role } from "@/platform/roles";
import { getAuthSessionSecret } from "@/platform/config/env";
import * as crypto from "node:crypto";

export const SESSION_COOKIE_NAME = "platform_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;
export const MAX_SESSION_AGE_SECONDS = 60 * 60 * 24;
const SESSION_VERSION = 1;

export type AuthSession = {
  userId: string;
  role: Role;
};

type SessionPayload = {
  v: number;
  uid: string;
  role: Role;
  iat: number;
  exp: number;
};

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  return bytesToBase64Url(bytes);
}

function fromBase64Url(value: string): string {
  const bytes = base64UrlToBytes(value);
  return new TextDecoder().decode(bytes);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 =
    typeof btoa === "function"
      ? btoa(binary)
      : Buffer.from(binary, "binary").toString("base64");

  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  if (!/^[A-Za-z0-9\-_]+$/.test(value)) {
    throw new Error("Invalid base64url payload.");
  }

  const padded = value + "=".repeat((4 - (value.length % 4 || 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary =
    typeof atob === "function"
      ? atob(base64)
      : Buffer.from(base64, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function signaturesMatch(signature: string, expectedSignature: string): boolean {
  const a = new TextEncoder().encode(signature);
  const b = new TextEncoder().encode(expectedSignature);

  if (a.byteLength !== b.byteLength) return false;
  return crypto.timingSafeEqual(a, b);
}

async function sign(data: string, secret: string): Promise<string> {
  const keyData = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data),
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

function toAuthSession(payload: SessionPayload): AuthSession | null {
  if (!payload || typeof payload !== "object") return null;
  if (payload.v !== SESSION_VERSION) return null;
  if (!isRole(payload.role)) return null;
  if (!payload.uid || typeof payload.uid !== "string") return null;
  if (
    !Number.isInteger(payload.exp) ||
    !Number.isInteger(payload.iat) ||
    payload.iat <= 0 ||
    payload.exp <= 0
  ) {
    return null;
  }

  if (payload.exp <= payload.iat) return null;

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp <= nowSeconds) return null;
  if (payload.iat > nowSeconds) return null;
  if (payload.exp - payload.iat > SESSION_TTL_SECONDS) return null;
  if (nowSeconds - payload.iat > MAX_SESSION_AGE_SECONDS) return null;

  return { userId: payload.uid, role: payload.role };
}

export async function encodeSessionToken(
  session: AuthSession,
): Promise<string> {
  const secret = getAuthSessionSecret();
  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    v: SESSION_VERSION,
    uid: session.userId,
    role: session.role,
    iat: nowSeconds,
    exp: nowSeconds + SESSION_TTL_SECONDS,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function buildSessionCookie(session: AuthSession) {
  const value = await encodeSessionToken(session);
  return {
    ...getSessionCookieOptions(),
    value,
  };
}

export async function decodeSessionToken(
  token: string | undefined,
): Promise<AuthSession | null> {
  const secret = getAuthSessionSecret();
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) return null;
  if (!/^[A-Za-z0-9\-_]+$/.test(signature)) return null;

  const expectedSignature = await sign(encodedPayload, secret);

  if (!signaturesMatch(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;
    return toAuthSession(payload);
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function getClearSessionCookieOptions() {
  return {
    ...getSessionCookieOptions(),
    maxAge: 0,
  };
}

export function getFallbackRole(): Role {
  return DEFAULT_ROLE;
}
