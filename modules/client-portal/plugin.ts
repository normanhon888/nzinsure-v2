import { FEATURE_FLAGS } from "@/platform/config/features";
import { ROLES } from "@/platform/roles";
import type { ModulePlugin } from "@/platform/registry/types";

export const clientPortalModulePlugin: ModulePlugin = {
  id: "client-portal",
  label: "Client Portal",
  requiredRole: ROLES.CLIENT,
  featureFlag: FEATURE_FLAGS.clientPortalModule,
  routes: {
    home: "/icura",
  },
  navigation: {
    href: "/icura",
    description: "Client-facing policy overviews and service requests.",
    order: 20,
  },
  allowedRoles: [ROLES.ADMIN, ROLES.CLIENT],
};

export default clientPortalModulePlugin;
