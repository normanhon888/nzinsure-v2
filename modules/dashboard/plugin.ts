import type { ModulePlugin } from "@/platform/registry/types";
import { ROLES } from "@/platform/roles/constants";

export const dashboardPlugin: ModulePlugin = {
  id: "dashboard",
  label: "Dashboard",
  requiredRole: ROLES.CLIENT,
  featureFlag: "ENABLE_DASHBOARD",
  dependsOn: [],
  routes: {
    home: "/dashboard",
  },
  navigation: {
    href: "/dashboard",
    description: "Role-aware landing page with key account insights.",
    order: 0,
  },
  allowedRoles: [ROLES.ADMIN, ROLES.ADVISOR, ROLES.CLIENT],
  onRegister() {
    console.info("[Dashboard] registered");
  },
};
