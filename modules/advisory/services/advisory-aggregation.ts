import { getAdvisoryService } from "@/modules/advisory/services/container";
import type { Advisory, AdvisoryStatus } from "@/modules/advisory/types";
import { getRoleAllowedTransitions } from "@/modules/advisory/workflow/transitions";
import type { Role } from "@/platform/roles";

export type AdvisoryStatusCounts = Record<AdvisoryStatus, number>;

export function getStatusCounts(): AdvisoryStatusCounts {
  const counts: AdvisoryStatusCounts = {
    draft: 0,
    "in-review": 0,
    approved: 0,
  };

  for (const advisory of getAdvisoryService().list()) {
    counts[advisory.status] += 1;
  }

  return counts;
}

export function getRecentAdvisories(limit: number): Advisory[] {
  if (limit <= 0) {
    return [];
  }

  return getAdvisoryService().list().slice(0, limit);
}

export function getRoleFilteredAdvisories(role: Role): Advisory[] {
  return getAdvisoryService()
    .list()
    .filter((advisory) => {
      if (advisory.status === "approved") {
        return true;
      }

      return getRoleAllowedTransitions(role, advisory.status).length > 0;
    });
}
