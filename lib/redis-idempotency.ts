const DEFAULT_LOCK_TTL_SECONDS = 90

function getRedisConfig() {
  const url =
    process.env.REDIS_REST_URL?.trim() ||
    process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token =
    process.env.REDIS_REST_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

  return { url, token }
}

function buildHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function acquireIdempotencyLock(
  key: string,
  lockValue: string,
  ttlSeconds = DEFAULT_LOCK_TTL_SECONDS,
): Promise<boolean> {
  const { url, token } = getRedisConfig()
  if (!url || !token) return true

  const endpoint = `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(lockValue)}?NX=true&EX=${ttlSeconds}`
  const response = await fetch(endpoint, { method: "POST", headers: buildHeaders(token) })
  if (!response.ok) {
    throw new Error(`redis_lock_failed:${response.status}`)
  }

  const payload = (await response.json().catch(() => null)) as
    | { result?: string | null }
    | null
  return payload?.result === "OK"
}

export async function releaseIdempotencyLock(key: string, lockValue: string): Promise<void> {
  const { url, token } = getRedisConfig()
  if (!url || !token) return

  const getResponse = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: buildHeaders(token),
  })
  if (!getResponse.ok) return

  const getPayload = (await getResponse.json().catch(() => null)) as
    | { result?: string | null }
    | null
  if (getPayload?.result !== lockValue) return

  await fetch(`${url}/del/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: buildHeaders(token),
  })
}
