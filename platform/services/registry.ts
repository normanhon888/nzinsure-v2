import type { AuthState } from "@/platform/auth/types";
import type { PlatformModule, PlatformModuleId } from "@/platform/registry/types";
import {
  getAllModules,
  getModuleById,
  getVisibleModules,
  runClientModuleInit,
  runServerModuleInit,
} from "@/platform/registry/module-loader";
import type { Role } from "@/platform/roles";
import { canAccess } from "@/platform/roles/permissions";
import { getServiceContainer } from "./container";

export type ModuleService = {
  getAllModules: () => readonly PlatformModule[];
  getModuleById: (moduleId: PlatformModuleId) => PlatformModule | null;
  getVisibleModules: (role: Role) => readonly PlatformModule[];
  runServerModuleInit: () => void;
  runClientModuleInit: () => void;
};

export type AuthService = {
  getVisibleModulesForRole: (role: Role) => readonly PlatformModule[];
  canAccessModule: (role: Role, moduleId: PlatformModuleId) => boolean;
  toAuthState: (payload: {
    role: Role;
    userId: string | null;
    isAuthenticated: boolean;
  }) => AuthState;
};

export type PlatformServices = {
  authService: AuthService;
  moduleService: ModuleService;
};

const REGISTERED_SERVICE_NAMES: readonly (keyof PlatformServices)[] = [
  "authService",
  "moduleService",
];

const serviceContainer = getServiceContainer<PlatformServices>();
let initialized = false;

function ensureServicesRegistered() {
  if (initialized) return;

  if (!serviceContainer.has("moduleService")) {
    serviceContainer.register("moduleService", () => ({
      getAllModules,
      getModuleById,
      getVisibleModules,
      runServerModuleInit,
      runClientModuleInit,
    }));
  }

  if (!serviceContainer.has("authService")) {
    serviceContainer.register("authService", (container) => ({
      getVisibleModulesForRole: (role) => {
        return container.get("moduleService").getVisibleModules(role);
      },
      canAccessModule: (role, moduleId) => {
        const platformModule = container.get("moduleService").getModuleById(moduleId);
        if (!platformModule) return false;
        return canAccess(role, platformModule.allowedRoles);
      },
      toAuthState: (payload) => ({
        role: payload.role,
        userId: payload.userId,
        isAuthenticated: payload.isAuthenticated,
      }),
    }));
  }

  initialized = true;
}

export function getService<TName extends keyof PlatformServices>(
  name: TName,
): PlatformServices[TName] {
  ensureServicesRegistered();
  return serviceContainer.get(name);
}

export function getRegisteredServiceNames(): readonly (keyof PlatformServices)[] {
  ensureServicesRegistered();
  return [...REGISTERED_SERVICE_NAMES];
}
