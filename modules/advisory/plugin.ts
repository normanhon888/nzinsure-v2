import { FEATURE_FLAGS } from "@/platform/config/features";
import { ROLES } from "@/platform/roles";
import type { ModulePlugin } from "@/platform/registry/types";

export const advisoryModulePlugin: ModulePlugin = {
  id: "advisory",
  label: "Advisory",
  dependsOn: ["client-portal"],
  requiredRole: ROLES.CLIENT,
  featureFlag: FEATURE_FLAGS.advisoryModule,
  routes: {
    home: "/advisory",
  },
  navigation: {
    href: "/advisory",
    description: "Core advisory case workflows.",
    order: 10,
  },
  allowedRoles: [ROLES.ADMIN, ROLES.ADVISOR, ROLES.CLIENT],
  onRegister: ({ bus }) => {
    void bus;
  },
  registerNav: ({ bus }) => {
    bus.emit("module:register-nav", {
      moduleId: "advisory",
      navigation: {
        href: "/advisory",
        description: "Core advisory case workflows.",
        order: 10,
      },
    });
  },
};

export default advisoryModulePlugin;
