import * as builtins from './builtins.ts'
import type { Context, ContextFromProviders } from './context.ts'
import { type Provider, type Providers } from './provider.ts'
import type { Token } from './token.ts'
import type { Simplify } from './utils.ts'

export interface InjectionContext<TContext extends Context> {
  context: Simplify<TContext>
  injector: Injector<TContext>
}

export type InjectorResult<T> =
  | {
      value: T
    }
  | {
      value?: never
    }

declare const __injector_context__: unique symbol
export interface Injector<TContext extends Context> {
  [__injector_context__]?: TContext
  get<T>(token: Token<T>): InjectorResult<T>
}

export function createInjector<
  TProviders extends Providers<TProviders, TParentProviders>,
  TParentProviders extends Providers<TParentProviders, {}>,
>(
  injectionContext: InjectionContext<ContextFromProviders<TProviders, TParentProviders>>,
  providers: TProviders,
  parentInjector: Injector<ContextFromProviders<TParentProviders, {}>> | undefined
): Injector<ContextFromProviders<TProviders, TParentProviders>> {
  const records = new Map<
    Token<unknown>,
    Omit<Provider<unknown, Record<PropertyKey, unknown>>, 'token'>
  >()
  const injector = {} as Injector<ContextFromProviders<TProviders, TParentProviders>>

  for (const { token, ...provider } of Object.values(providers)) {
    records.set(token, provider as Provider<unknown, Record<PropertyKey, unknown>>)
  }
  records.set(builtins.Context, { factory: () => injectionContext.context })
  records.set(builtins.InjectionContext, {
    factory: () => injectionContext,
    value: injectionContext,
  })
  records.set(builtins.Injector, { factory: () => injector, value: injector })
  records.set(builtins.Providers, { factory: () => providers, value: providers })

  function get<T>(token: Token<T>): InjectorResult<T> {
    let record = records.get(token)

    if (!record && parentInjector) {
      return parentInjector.get(token)
    }

    if (!record) {
      return {}
    }

    if ('value' in record) {
      return {
        value: record.value as T,
      }
    }

    record.value = record.factory(injectionContext as any)

    return {
      value: record.value as T,
    }
  }

  injector.get = get
  return injector
}
