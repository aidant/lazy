import type { Injector } from './injector.ts'
import type { Provider, Providers } from './provider.ts'
import type { Simplify } from './utils.ts'

export type Context = { [K in string]: unknown }

export type ContextFromProviders<
  TProviders extends Providers,
  TParentProviders extends Providers,
> = Simplify<
  {
    [TPropertyKey in keyof TProviders]: Provider.Type<TProviders[TPropertyKey]>
  } & {
    [TPropertyKey in keyof Omit<TParentProviders, keyof TProviders>]: Provider.Type<
      TParentProviders[TPropertyKey]
    >
  }
>

export function createContext<TProviders extends Providers, TParentProviders extends Providers>(
  providers: TProviders,
  parentProviders: TParentProviders | undefined,
  injector: Injector<ContextFromProviders<TProviders, TParentProviders>>
): ContextFromProviders<TProviders, TParentProviders> {
  const properties = {} as {
    [TPropertyKey in string]: TypedPropertyDescriptor<
      ContextFromProviders<TProviders, TParentProviders>[TPropertyKey]
    >
  }

  for (const [propertyKey, propertyDescriptor] of Object.entries(
    Object.getOwnPropertyDescriptors(parentProviders || {})
  ).concat(Object.entries(Object.getOwnPropertyDescriptors(providers)))) {
    properties[propertyKey] = {
      enumerable: propertyDescriptor.enumerable ?? true,
      configurable: propertyDescriptor.configurable ?? true,
      get: () => injector.get(providers[propertyKey]!.token) as any,
    }
  }

  return Object.defineProperties(
    {} as ContextFromProviders<TProviders, TParentProviders>,
    properties
  )
}
