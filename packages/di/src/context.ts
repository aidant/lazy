import type { Injector } from './injector.ts'
import type { Provider, Providers } from './provider.ts'

export type Context = { [K in PropertyKey]: unknown }

export type ContextFromProvidersImpl<
  TProviders extends Providers<TProviders, TParentProviders>,
  TParentProviders extends Providers<TParentProviders, {}>,
> = {
  [TPropertyKey in keyof TProviders]: Provider.Type<TProviders[TPropertyKey]>
}

export type ContextFromProviders<
  TProviders extends Providers<TProviders, TParentProviders>,
  TParentProviders extends Providers<TParentProviders, {}>,
> = ContextFromProvidersImpl<TProviders, TParentProviders> &
  Omit<ContextFromProvidersImpl<TParentProviders, {}>, keyof TProviders>

export function createContext<
  TProviders extends Providers<TProviders, TParentProviders>,
  TParentProviders extends Providers<TParentProviders, {}>,
>(
  providers: TProviders,
  parentProviders: TParentProviders | undefined,
  injector: Injector<ContextFromProviders<TProviders, TParentProviders>>
): ContextFromProviders<TProviders, TParentProviders> {
  const properties = {} as {
    [TPropertyKey in PropertyKey]: TypedPropertyDescriptor<
      ContextFromProviders<TProviders, TParentProviders>[TPropertyKey]
    >
  }

  if (parentProviders) {
    for (const [propertyKey, propertyDescriptor] of Object.entries(
      Object.getOwnPropertyDescriptors(parentProviders)
    )) {
      properties[propertyKey] = {
        enumerable: propertyDescriptor.enumerable ?? true,
        configurable: propertyDescriptor.configurable ?? true,
        get: () => injector.get(parentProviders[propertyKey]!.token).value! as any,
      }
    }
  }

  for (const [propertyKey, propertyDescriptor] of Object.entries(
    Object.getOwnPropertyDescriptors(providers)
  )) {
    properties[propertyKey] = {
      enumerable: propertyDescriptor.enumerable ?? true,
      configurable: propertyDescriptor.configurable ?? true,
      get: () => injector.get(providers[propertyKey]!.token).value! as any,
    }
  }

  return Object.defineProperties(
    {} as ContextFromProviders<TProviders, TParentProviders>,
    properties
  )
}
