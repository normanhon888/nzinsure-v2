"use client";

import { createContext, useContext } from "react";
import { DEFAULT_ROLE, type Role } from "@/platform/roles";
import { useSessionSync } from "@/platform/auth/client";
import type { PlatformModule, PlatformModuleId } from "@/platform/registry/types";
import type { AuthState } from "@/platform/auth/types";

type AuthContextValue = {
  role: Role;
  userId: string | null;
  isAuthenticated: boolean;
  visibleModules: readonly PlatformModule[];
  canAccessModule: (moduleId: PlatformModuleId) => boolean;
  refreshSession: () => Promise<void>;
};

const defaultContextValue: AuthContextValue = {
  role: DEFAULT_ROLE,
  userId: null,
  isAuthenticated: false,
  visibleModules: [],
  canAccessModule: () => false,
  refreshSession: async () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultContextValue);

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: AuthState;
}) {
  const { role, userId, isAuthenticated, refreshSession } =
    useSessionSync(initialSession);

  return (
    <AuthContext.Provider
      value={{
        role,
        userId,
        isAuthenticated,
        visibleModules: [],
        canAccessModule: () => false,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
