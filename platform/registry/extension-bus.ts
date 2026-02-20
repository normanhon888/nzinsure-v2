import type { ModuleExtensionBus, ModuleExtensionEventMap } from "./types";

type ExtensionHandler<K extends keyof ModuleExtensionEventMap> = (
  payload: ModuleExtensionEventMap[K],
) => void;

type HandlerMap = {
  [K in keyof ModuleExtensionEventMap]: Set<ExtensionHandler<K>>;
};

export const EXTENSION_EVENTS = {
  REGISTER_NAV: "module:register-nav",
  REGISTER_ROUTES: "module:register-routes",
  REGISTER_PERMISSIONS: "module:register-permissions",
} as const;

export function createExtensionBus(): ModuleExtensionBus {
  const handlers: HandlerMap = {
    "module:register-nav": new Set(),
    "module:register-routes": new Set(),
    "module:register-permissions": new Set(),
  };

  return {
    on<K extends keyof ModuleExtensionEventMap>(
      event: K,
      handler: ExtensionHandler<K>,
    ) {
      handlers[event].add(handler);
      return () => {
        handlers[event].delete(handler);
      };
    },
    emit<K extends keyof ModuleExtensionEventMap>(
      event: K,
      payload: ModuleExtensionEventMap[K],
    ) {
      handlers[event].forEach((handler) => {
        handler(payload);
      });
    },
  };
}
