export type ServiceFactory<
  TServices extends Record<string, unknown>,
  TName extends keyof TServices,
> = (container: ServiceContainer<TServices>) => TServices[TName];

export interface ServiceContainer<TServices extends Record<string, unknown>> {
  register<TName extends keyof TServices>(
    name: TName,
    factory: ServiceFactory<TServices, TName>,
  ): void;
  get<TName extends keyof TServices>(name: TName): TServices[TName];
  has<TName extends keyof TServices>(name: TName): boolean;
}
