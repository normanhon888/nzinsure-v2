"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_ROLE, isRole } from "@/platform/roles";
import type { AuthState } from "@/platform/auth/types";

type SessionApiResponse = {
  session: {
    role: string;
    userId: string | null;
  } | null;
};

const FALLBACK_AUTH_STATE: AuthState = {
  role: DEFAULT_ROLE,
  userId: null,
  isAuthenticated: false,
};

function normalizeSession(
  session: SessionApiResponse["session"] | null | undefined,
): AuthState {
  if (!session || !isRole(session.role)) {
    return {
      role: DEFAULT_ROLE,
      userId: null,
      isAuthenticated: false,
    };
  }

  return {
    role: session.role,
    userId: session.userId ?? null,
    isAuthenticated: Boolean(session.userId),
  };
}

export function useSessionSync(
  initial: AuthState,
) {
  const [state, setState] = useState(initial);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        setState(FALLBACK_AUTH_STATE);
        return;
      }

      const payload = (await response.json()) as SessionApiResponse;
      setState(normalizeSession(payload.session));
    } catch {
      setState(FALLBACK_AUTH_STATE);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  return {
    role: state.role,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
    refreshSession,
  };
}
