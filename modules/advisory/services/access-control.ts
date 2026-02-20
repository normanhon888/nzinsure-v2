import { redirect } from "next/navigation";
import { getServerAuthContext } from "@/platform/auth/server";
import { ROLES, type Role } from "@/platform/roles";
import { canAccess } from "@/platform/roles/permissions";

export const ADVISORY_READ_ROLES: readonly Role[] = [
  ROLES.ADMIN,
  ROLES.ADVISOR,
  ROLES.CLIENT,
];

export const ADVISORY_WRITE_ROLES: readonly Role[] = [ROLES.ADMIN, ROLES.ADVISOR];

export async function requireAdvisoryAccess(allowedRoles: readonly Role[]) {
  const auth = await getServerAuthContext();

  if (!canAccess(auth.role, allowedRoles)) {
    redirect("/");
  }

  return auth;
}
