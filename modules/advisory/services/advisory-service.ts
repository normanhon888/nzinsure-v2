import type {
  Advisory,
  AdvisoryStatus,
  CreateAdvisoryInput,
  AdvisoryTransitionHistoryEntry,
} from "@/modules/advisory/types";
import type { Role } from "@/platform/roles";
import { canTransition } from "@/modules/advisory/workflow/state-machine";
import { canRoleTransition } from "@/modules/advisory/workflow/transitions";

type AdvisoryServiceScope = typeof globalThis & {
  __advisory_store__?: Map<string, Advisory>;
};

function getStore() {
  const scope = globalThis as AdvisoryServiceScope;

  if (!scope.__advisory_store__) {
    const now = new Date().toISOString();
    scope.__advisory_store__ = new Map<string, Advisory>([
      [
        "adv-seed-1",
        {
          id: "adv-seed-1",
          clientName: "Harbor Lane Holdings",
          riskProfile: "Medium",
          coverageNotes:
            "Review interruption limits and cyber endorsements in next renewal cycle.",
          status: "draft",
          history: [],
          createdAt: now,
        },
      ],
    ]);
  }

  return scope.__advisory_store__;
}

function createAdvisoryId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `adv-${Math.random().toString(36).slice(2, 10)}`;
}

function withHistory(advisory: Advisory): Advisory {
  const maybeHistory = (advisory as Advisory & {
    history?: AdvisoryTransitionHistoryEntry[];
  }).history;

  return {
    ...advisory,
    history: Array.isArray(maybeHistory) ? maybeHistory : [],
  };
}

export type AdvisoryService = {
  list: () => Advisory[];
  getById: (id: string) => Advisory | null;
  create: (input: CreateAdvisoryInput) => Advisory;
  transitionStatus: (
    id: string,
    targetStatus: AdvisoryStatus,
    role: Role,
  ) => Advisory | null;
};

export function createAdvisoryService(): AdvisoryService {
  const store = getStore();

  return {
    list: () => {
      return [...store.values()]
        .map((advisory) => withHistory(advisory))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    getById: (id) => {
      const advisory = store.get(id);
      return advisory ? withHistory(advisory) : null;
    },
    create: (input) => {
      const advisory: Advisory = {
        id: createAdvisoryId(),
        clientName: input.clientName,
        riskProfile: input.riskProfile,
        coverageNotes: input.coverageNotes,
        status: input.status ?? "draft",
        history: [],
        createdAt: new Date().toISOString(),
      };

      store.set(advisory.id, advisory);
      return advisory;
    },
    transitionStatus: (id, targetStatus, role) => {
      const advisory = store.get(id);
      if (!advisory) return null;
      const normalized = withHistory(advisory);

      if (!canTransition(normalized.status, targetStatus)) {
        return null;
      }

      if (!canRoleTransition(role, normalized.status, targetStatus)) {
        return null;
      }

      const nextHistoryEntry: AdvisoryTransitionHistoryEntry = {
        from: normalized.status,
        to: targetStatus,
        byRole: role,
        at: new Date().toISOString(),
      };

      const next = {
        ...normalized,
        status: targetStatus,
        history: [...normalized.history, nextHistoryEntry],
      };
      store.set(id, next);
      return next;
    },
  };
}
