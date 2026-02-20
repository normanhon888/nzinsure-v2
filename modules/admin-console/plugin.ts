import { FEATURE_FLAGS } from "@/platform/config/features";
import { ROLES } from "@/platform/roles";
import type { ModulePlugin } from "@/platform/registry/types";

export const adminConsoleModulePlugin: ModulePlugin = {
  id: "admin-console",
  label: "Admin Console",
  requiredRole: ROLES.ADMIN,
  featureFlag: FEATURE_FLAGS.adminConsoleModule,
  routes: {
    home: "/admin",
  },
  navigation: {
    href: "/admin",
    description: "Platform administration and governance controls.",
    order: 40,
  },
  allowedRoles: [ROLES.ADMIN],
};

export default adminConsoleModulePlugin;
