import { FEATURE_FLAGS } from "@/platform/config/features";
import { ROLES } from "@/platform/roles";
import type { ModulePlugin } from "@/platform/registry/types";

export const advisorWorkbenchModulePlugin: ModulePlugin = {
  id: "advisor-workbench",
  label: "Advisor Workbench",
  requiredRole: ROLES.ADVISOR,
  featureFlag: FEATURE_FLAGS.advisorWorkbenchModule,
  routes: {
    home: "/advisor",
  },
  navigation: {
    href: "/advisor",
    description: "Advisor productivity and case management workspace.",
    order: 30,
  },
  allowedRoles: [ROLES.ADMIN, ROLES.ADVISOR],
};

export default advisorWorkbenchModulePlugin;
