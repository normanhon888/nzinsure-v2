import { ROLES } from "@/platform/roles/constants";

export const ALL_ROLES = [ROLES.ADMIN, ROLES.ADVISOR, ROLES.CLIENT] as const;

export type Role = (typeof ALL_ROLES)[number];

export const DEFAULT_ROLE: Role = ROLES.CLIENT;

export function isRole(value: string): value is Role {
  return (ALL_ROLES as readonly string[]).includes(value);
}

export { ROLES };
