import type { ModuleExtensionBus, ModulePlugin, PlatformModuleId } from "./types";
import { traceLifecycleExecution } from "@/platform/telemetry/lifecycle-trace";

const registeredModules = new Set<PlatformModuleId>();
const serverInitializedModules = new Set<PlatformModuleId>();
const clientInitializedModules = new Set<PlatformModuleId>();

function runPluginHook(
  modulePlugin: ModulePlugin,
  bus: ModuleExtensionBus,
  hook: keyof Pick<ModulePlugin, "onRegister" | "onServerInit" | "onClientInit" | "registerRoutes" | "registerNav" | "registerPermissions">,
) {
  const fn = modulePlugin[hook];
  if (typeof fn !== "function") return;

  if (hook === "onRegister" || hook === "onServerInit" || hook === "onClientInit") {
    traceLifecycleExecution(modulePlugin.id, hook, () => {
      fn({ bus });
    });
    return;
  }

  fn({ bus });
}

export function runOnRegister(
  modulePlugins: readonly ModulePlugin[],
  bus: ModuleExtensionBus,
) {
  modulePlugins.forEach((modulePlugin) => {
    if (registeredModules.has(modulePlugin.id)) return;
    runPluginHook(modulePlugin, bus, "onRegister");
    runPluginHook(modulePlugin, bus, "registerRoutes");
    runPluginHook(modulePlugin, bus, "registerNav");
    runPluginHook(modulePlugin, bus, "registerPermissions");
    registeredModules.add(modulePlugin.id);
  });
}

export function runOnServerInit(
  modulePlugins: readonly ModulePlugin[],
  bus: ModuleExtensionBus,
) {
  modulePlugins.forEach((modulePlugin) => {
    if (serverInitializedModules.has(modulePlugin.id)) return;
    runPluginHook(modulePlugin, bus, "onServerInit");
    serverInitializedModules.add(modulePlugin.id);
  });
}

export function runOnClientInit(
  modulePlugins: readonly ModulePlugin[],
  bus: ModuleExtensionBus,
) {
  modulePlugins.forEach((modulePlugin) => {
    if (clientInitializedModules.has(modulePlugin.id)) return;
    runPluginHook(modulePlugin, bus, "onClientInit");
    clientInitializedModules.add(modulePlugin.id);
  });
}
