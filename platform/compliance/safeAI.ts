import { applyRuleGate } from "../rules/ruleGate";

export function safeAIResponse(raw: string) {
  const cleaned = applyRuleGate(raw);
  return cleaned;
}
