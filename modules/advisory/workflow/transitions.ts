import { ROLES, type Role } from "@/platform/roles";
import {
  ADVISORY_STATUSES,
  canTransition,
  type AdvisoryStatus,
} from "@/modules/advisory/workflow/state-machine";

type AdvisoryTransitionRule = readonly [AdvisoryStatus, AdvisoryStatus];

const ROLE_TRANSITION_RULES: Readonly<Record<Role, readonly AdvisoryTransitionRule[]>> = {
  [ROLES.ADMIN]: [
    ["draft", "in-review"],
    ["in-review", "draft"],
    ["in-review", "approved"],
    ["approved", "in-review"],
  ],
  [ROLES.ADVISOR]: [
    ["draft", "in-review"],
    ["in-review", "draft"],
  ],
  [ROLES.CLIENT]: [],
};

export function canRoleTransition(
  role: Role,
  from: AdvisoryStatus,
  to: AdvisoryStatus,
): boolean {
  if (!canTransition(from, to)) {
    return false;
  }

  return ROLE_TRANSITION_RULES[role].some(
    ([allowedFrom, allowedTo]) => allowedFrom === from && allowedTo === to,
  );
}

export function getRoleAllowedTransitions(
  role: Role,
  from: AdvisoryStatus,
): AdvisoryStatus[] {
  return ADVISORY_STATUSES.filter((targetStatus) =>
    canRoleTransition(role, from, targetStatus),
  );
}
