import type { Role } from "@/platform/roles";
import {
  ADVISORY_STATUSES,
  type AdvisoryStatus,
} from "@/modules/advisory/workflow/state-machine";

export { ADVISORY_STATUSES, type AdvisoryStatus };

export type AdvisoryTransitionHistoryEntry = {
  from: AdvisoryStatus;
  to: AdvisoryStatus;
  byRole: Role;
  at: string;
};

export type Advisory = {
  id: string;
  clientName: string;
  riskProfile: string;
  coverageNotes: string;
  status: AdvisoryStatus;
  history: AdvisoryTransitionHistoryEntry[];
  createdAt: string;
};

export type CreateAdvisoryInput = {
  clientName: string;
  riskProfile: string;
  coverageNotes: string;
  status?: AdvisoryStatus;
};

export function isAdvisoryStatus(value: string): value is AdvisoryStatus {
  return (ADVISORY_STATUSES as readonly string[]).includes(value);
}
