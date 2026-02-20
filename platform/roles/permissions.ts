import type { Role } from "@/platform/roles";

export type AccessRule = readonly Role[];

export function canAccess(role: Role, allowedRoles: AccessRule): boolean {
  return allowedRoles.includes(role);
}
