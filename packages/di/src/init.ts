import { createContext, type Context, type ContextFromProviders } from './context.ts'
import { createInjector, type InjectionContext } from './injector.ts'
import type { Providers } from './provider.ts'
import { Providers as ProvidersImpl } from './builtins.ts'

export interface InitOptions<TProviders extends Providers> {
  with?: TProviders
  parent?: InjectionContext<Context>
}

export function init<TProviders extends Providers, TParentProviders extends Providers>(
  options?: InitOptions<TProviders>
): InjectionContext<ContextFromProviders<TProviders, TParentProviders>> {
  const injectionContext = {} as InjectionContext<
    ContextFromProviders<TProviders, TParentProviders>
  >

  const providers = options?.with || ({} as TProviders)
  const injector = createInjector(injectionContext, providers)
  const context = createContext<TProviders, TParentProviders>(
    providers,
    options?.parent?.injector.get(ProvidersImpl) as TParentProviders,
    injector
  )

  injectionContext.injector = injector
  injectionContext.context = context

  return injectionContext
}
