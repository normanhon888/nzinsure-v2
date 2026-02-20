type RuleCheckResult =
  | { ok: true }
  | { ok: false; code: string; message: string }

function containsProhibitedContent(value: string): boolean {
  const normalized = value.toLowerCase()
  return normalized.includes("ssn") || normalized.includes("social security")
}

export function enforceRulesGate(payload: unknown): RuleCheckResult {
  if (payload == null) return { ok: true }

  if (typeof payload === "string") {
    if (containsProhibitedContent(payload)) {
      return {
        ok: false,
        code: "RULES_BLOCKED_CONTENT",
        message: "Response blocked by rules policy.",
      }
    }
    return { ok: true }
  }

  if (typeof payload === "object") {
    const serialized = JSON.stringify(payload)
    if (containsProhibitedContent(serialized)) {
      return {
        ok: false,
        code: "RULES_BLOCKED_CONTENT",
        message: "Response blocked by rules policy.",
      }
    }
  }

  return { ok: true }
}
