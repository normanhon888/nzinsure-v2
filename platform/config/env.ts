const REQUIRED_ENV_KEYS = ["AUTH_SESSION_SECRET"] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

const requiredEnvCache = new Map<RequiredEnvKey, string>();

export function getRequiredEnv(name: RequiredEnvKey): string {
  const cached = requiredEnvCache.get(name);
  if (cached) return cached;

  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Set a strong value in your environment.`);
  }

  requiredEnvCache.set(name, value);
  return value;
}

export function getAuthSessionSecret(): string {
  return getRequiredEnv("AUTH_SESSION_SECRET");
}

export function validateRequiredEnv(): void {
  for (const key of REQUIRED_ENV_KEYS) {
    getRequiredEnv(key);
  }
}

