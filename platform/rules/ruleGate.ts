export function applyRuleGate(output: string) {
  if (!output) return output;

  // Block obvious sensitive patterns
  const forbiddenPatterns = [
    /password/i,
    /api[_-]?key/i,
    /secret/i,
    /ssn/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(output)) {
      throw new Error("RuleGate: Sensitive content detected");
    }
  }

  return output;
}
