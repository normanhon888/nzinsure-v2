import type { ModulePlugin, PlatformModule, PlatformModuleId } from "./types";
import { topologicalSort, validateDependencyGraph } from "./dependency-graph";
import { runOnRegister, runOnServerInit, runOnClientInit } from "./lifecycle";
import { createExtensionBus } from "./extension-bus";
import { isFeatureEnabled } from "@/platform/config/features";
import { ROLES } from "@/platform/roles/constants";
import { getDependencyGraphSnapshot as getGraphSnapshot } from "@/platform/telemetry/dependency-trace";
import type { Role } from "@/platform/roles";

// ===== Import real plugin exports (matching actual names) =====
import { advisoryModulePlugin } from "@/modules/advisory";
import { clientPortalModulePlugin } from "@/modules/client-portal/plugin";
import { advisorWorkbenchModulePlugin } from "@/modules/advisor-workbench/plugin";
import { adminConsoleModulePlugin } from "@/modules/admin-console/plugin";
import { dashboardPlugin } from "@/modules/dashboard/plugin";

// ===== SINGLE SOURCE OF MODULES =====
const MODULE_PLUGINS: readonly ModulePlugin[] = [
  dashboardPlugin,
  advisoryModulePlugin,
  clientPortalModulePlugin,
  advisorWorkbenchModulePlugin,
  adminConsoleModulePlugin,
];

// ===== Dependency validation =====
validateDependencyGraph(MODULE_PLUGINS);

// ===== Topological sort =====
const SORTED_MODULES = topologicalSort(MODULE_PLUGINS);
const moduleExtensionBus = createExtensionBus();

// ===== Lifecycle registration =====
runOnRegister(SORTED_MODULES, moduleExtensionBus);

// ===== Public API =====

function toPlatformModule(modulePlugin: ModulePlugin): PlatformModule {
  return {
    ...modulePlugin,
    href: modulePlugin.navigation.href,
    description: modulePlugin.navigation.description,
    allowedRoles: modulePlugin.allowedRoles ?? [modulePlugin.requiredRole],
  };
}

export function getAllModules(): readonly PlatformModule[] {
  return SORTED_MODULES.map(toPlatformModule);
}

export function getModuleById(id: PlatformModuleId): PlatformModule | null {
  const modulePlugin = SORTED_MODULES.find((m) => m.id === id);
  if (!modulePlugin) return null;
  return toPlatformModule(modulePlugin);
}

export function getVisibleModules(role: Role): readonly PlatformModule[] {
  return SORTED_MODULES
    .filter((plugin) => {
      const featureEnabled = isFeatureEnabled(plugin.featureFlag);
      const roleAllowed =
        !plugin.requiredRole ||
        role === plugin.requiredRole ||
        role === ROLES.ADMIN;

      return featureEnabled && roleAllowed;
    })
    .map(toPlatformModule)
    .sort((a, b) => {
      const orderA = a.navigation.order ?? 999;
      const orderB = b.navigation.order ?? 999;
      return orderA - orderB;
    });
}

// ===== Lifecycle execution =====

export function runServerModuleInit(): void {
  runOnServerInit(SORTED_MODULES, moduleExtensionBus);
}

export function runClientModuleInit(): void {
  runOnClientInit(SORTED_MODULES, moduleExtensionBus);
}

// ===== Dependency Snapshot passthrough =====

export function getDependencyGraphSnapshot() {
  return getGraphSnapshot();
}
