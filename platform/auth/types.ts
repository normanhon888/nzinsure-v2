import type { Role } from "@/platform/roles";

export type AuthState = {
  role: Role;
  userId: string | null;
  isAuthenticated: boolean;
};
