import * as builtins from './builtins.ts'
import type { Context, ContextFromProviders } from './context.ts'
import type { Provider, Providers } from './provider.ts'
import type { Token } from './token.ts'

export interface InjectionContext<TContext extends Context> {
  context: TContext
  injector: Injector<TContext>
}

export interface InjectorOptions {
  optional?: boolean
}

export interface Injector<TContext extends Context> {
  get<T>(token: Token<T>, options?: InjectorOptions): T
}

export function createInjector<TProviders extends Providers, TParentProviders extends Providers>(
  injectionContext: InjectionContext<ContextFromProviders<TProviders, TParentProviders>>,
  providers: TProviders
): Injector<ContextFromProviders<TProviders, TParentProviders>> {
  const records = new Map<Token<unknown>, Omit<Provider<unknown>, 'token'>>()
  const injector = {} as Injector<ContextFromProviders<TProviders, TParentProviders>>

  for (const { token, ...provider } of Object.values(providers)) {
    records.set(token, provider)
  }
  records.set(builtins.Context, { factory: () => injectionContext.context })
  records.set(builtins.InjectionContext, {
    factory: () => injectionContext,
    value: injectionContext,
  })
  records.set(builtins.Injector, { factory: () => injector, value: injector })
  records.set(builtins.Providers, { factory: () => providers, value: providers })

  function get<T>(token: Token<T>, options?: InjectorOptions): T {
    let record = records.get(token)

    if (!record) {
      if (options?.optional) {
        return undefined as any
      } else {
        throw new Error(`Unable to get "${token.description}"`)
      }
    }

    if ('value' in record) {
      return record.value as T
    }

    record.value = record.factory(injectionContext as any)

    return record.value as T
  }

  injector.get = get
  return injector
}
