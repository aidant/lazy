import { Providers as ProvidersImpl } from './builtins.ts'
import { createContext, type ContextFromProviders } from './context.ts'
import { createInjector, type InjectionContext } from './injector.ts'
import type { Providers } from './provider.ts'

export interface InitOptions<
  TProviders extends Providers<TProviders, TParentProviders>,
  TParentProviders extends Providers<TParentProviders, {}>,
> {
  with?: TProviders
  parent?: InjectionContext<ContextFromProviders<TParentProviders, {}>>
}

export function init<
  TProviders extends Providers<TProviders, TParentProviders> = {},
  TParentProviders extends Providers = {},
>(
  options?: InitOptions<TProviders, TParentProviders>
): InjectionContext<ContextFromProviders<TProviders, TParentProviders>> {
  const injectionContext = {} as InjectionContext<
    ContextFromProviders<TProviders, TParentProviders>
  >

  const providers = options?.with || ({} as TProviders)
  const injector = createInjector(injectionContext, providers, options?.parent?.injector)
  const context = createContext<TProviders, TParentProviders>(
    providers,
    options?.parent?.injector.get(ProvidersImpl).value as TParentProviders | undefined,
    injector
  )

  injectionContext.injector = injector
  injectionContext.context = context

  return injectionContext
}
