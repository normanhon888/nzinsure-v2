import type { FeatureFlag } from "@/platform/config/features";
import type { Role } from "@/platform/roles";

export type PlatformModuleId =
  | "dashboard"
  | "advisory"
  | "client-portal"
  | "advisor-workbench"
  | "admin-console";

export type ModuleRoutes = {
  home: string;
};

export type ModuleNavigationConfig = {
  href: string;
  description: string;
  order: number;
};

export type ModuleNavRegistration = {
  moduleId: PlatformModuleId;
  navigation: ModuleNavigationConfig;
};

export type ModuleRoutesRegistration = {
  moduleId: PlatformModuleId;
  routes: ModuleRoutes;
};

export type ModulePermissionsRegistration = {
  moduleId: PlatformModuleId;
  allowedRoles: readonly Role[];
};

export type ModuleExtensionEventMap = {
  "module:register-nav": ModuleNavRegistration;
  "module:register-routes": ModuleRoutesRegistration;
  "module:register-permissions": ModulePermissionsRegistration;
};

export type ModuleExtensionBus = {
  on<K extends keyof ModuleExtensionEventMap>(
    event: K,
    handler: (payload: ModuleExtensionEventMap[K]) => void,
  ): () => void;
  emit<K extends keyof ModuleExtensionEventMap>(
    event: K,
    payload: ModuleExtensionEventMap[K],
  ): void;
};

export type ModuleLifecycleContext = {
  bus: ModuleExtensionBus;
};

export type ModulePlugin = {
  id: PlatformModuleId;
  label: string;
  requiredRole: Role;
  dependsOn?: readonly PlatformModuleId[];
  featureFlag?: FeatureFlag;
  routes: ModuleRoutes;
  navigation: ModuleNavigationConfig;
  allowedRoles?: readonly Role[];
  onRegister?: (context: ModuleLifecycleContext) => void;
  onServerInit?: (context: ModuleLifecycleContext) => void;
  onClientInit?: (context: ModuleLifecycleContext) => void;
  registerRoutes?: (context: ModuleLifecycleContext) => void;
  registerNav?: (context: ModuleLifecycleContext) => void;
  registerPermissions?: (context: ModuleLifecycleContext) => void;
};

export type PlatformModule = ModulePlugin & {
  href: string;
  description: string;
  allowedRoles: readonly Role[];
};
