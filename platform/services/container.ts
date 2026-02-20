import type { ServiceContainer, ServiceFactory } from "./types";

class PlatformServiceContainer<TServices extends Record<string, unknown>>
  implements ServiceContainer<TServices>
{
  private readonly factories = new Map<
    keyof TServices,
    ServiceFactory<TServices, keyof TServices>
  >();

  private readonly instances = new Map<keyof TServices, TServices[keyof TServices]>();

  register<TName extends keyof TServices>(
    name: TName,
    factory: ServiceFactory<TServices, TName>,
  ): void {
    if (this.factories.has(name) || this.instances.has(name)) {
      throw new Error(`Service "${String(name)}" is already registered.`);
    }

    this.factories.set(
      name,
      factory as ServiceFactory<TServices, keyof TServices>,
    );
  }

  get<TName extends keyof TServices>(name: TName): TServices[TName] {
    const cached = this.instances.get(name);
    if (cached !== undefined) {
      return cached as TServices[TName];
    }

    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Service "${String(name)}" is not registered.`);
    }

    const instance = factory(this);
    this.instances.set(name, instance);
    return instance as TServices[TName];
  }

  has<TName extends keyof TServices>(name: TName): boolean {
    return this.factories.has(name) || this.instances.has(name);
  }
}

const CONTAINER_KEY = "__platform_service_container__";

type GlobalScope = typeof globalThis & {
  [CONTAINER_KEY]?: PlatformServiceContainer<Record<string, unknown>>;
};

function getGlobalScope(): GlobalScope {
  return globalThis as GlobalScope;
}

export function getServiceContainer<TServices extends Record<string, unknown>>() {
  const scope = getGlobalScope();
  if (!scope[CONTAINER_KEY]) {
    scope[CONTAINER_KEY] = new PlatformServiceContainer<Record<string, unknown>>();
  }

  return scope[CONTAINER_KEY] as ServiceContainer<TServices>;
}
