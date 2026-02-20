import { getAdvisoryService } from "@/modules/advisory/services/container";
import type { Advisory, AdvisoryStatus } from "@/modules/advisory/types";
import { getRoleAllowedTransitions } from "@/modules/advisory/workflow/transitions";
import type { Role } from "@/platform/roles";

export type GlobalStatusCounts = Record<AdvisoryStatus, number>;

export type PendingTask = {
  id: string;
  title: string;
  summary: string;
  status: AdvisoryStatus;
  href: string;
  createdAt: string;
};

export type RecentActivityItem = {
  id: string;
  text: string;
  occurredAt: string;
  href: string;
};

function canRoleSeeAdvisory(role: Role, advisory: Advisory): boolean {
  if (advisory.status === "approved") {
    return true;
  }

  return getRoleAllowedTransitions(role, advisory.status).length > 0;
}

function getRoleScopedAdvisories(role: Role): Advisory[] {
  return getAdvisoryService().list().filter((advisory) => canRoleSeeAdvisory(role, advisory));
}

export function getGlobalStatusCounts(role: Role): GlobalStatusCounts {
  const counts: GlobalStatusCounts = {
    draft: 0,
    "in-review": 0,
    approved: 0,
  };

  for (const advisory of getRoleScopedAdvisories(role)) {
    counts[advisory.status] += 1;
  }

  return counts;
}

export function getPendingTasks(role: Role): PendingTask[] {
  return getRoleScopedAdvisories(role)
    .filter((advisory) => getRoleAllowedTransitions(role, advisory.status).length > 0)
    .map((advisory) => ({
      id: advisory.id,
      title: `Review ${advisory.clientName}`,
      summary: `${advisory.riskProfile} risk profile is waiting in ${advisory.status}.`,
      status: advisory.status,
      href: `/advisory/${advisory.id}`,
      createdAt: advisory.createdAt,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getRecentActivity(role: Role): RecentActivityItem[] {
  const activity = getRoleScopedAdvisories(role).flatMap((advisory) => {
    const created: RecentActivityItem = {
      id: `${advisory.id}-created`,
      text: `${advisory.clientName} advisory created`,
      occurredAt: advisory.createdAt,
      href: `/advisory/${advisory.id}`,
    };

    const transitions: RecentActivityItem[] = advisory.history.map((entry, index) => ({
      id: `${advisory.id}-history-${index}`,
      text: `${advisory.clientName} moved ${entry.from} to ${entry.to} by ${entry.byRole}`,
      occurredAt: entry.at,
      href: `/advisory/${advisory.id}`,
    }));

    return [created, ...transitions];
  });

  return activity.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}
