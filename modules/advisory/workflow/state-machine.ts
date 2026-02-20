export const ADVISORY_STATUSES = ["draft", "in-review", "approved"] as const;

export type AdvisoryStatus = (typeof ADVISORY_STATUSES)[number];

const ALLOWED_TRANSITIONS: Readonly<Record<AdvisoryStatus, readonly AdvisoryStatus[]>> = {
  draft: ["in-review"],
  "in-review": ["draft", "approved"],
  approved: ["in-review"],
};

export function canTransition(from: AdvisoryStatus, to: AdvisoryStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function getAllowedTransitions(from: AdvisoryStatus): readonly AdvisoryStatus[] {
  return ALLOWED_TRANSITIONS[from];
}
