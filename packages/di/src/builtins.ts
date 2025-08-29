import type { Context as TContext } from './context.ts'
import type { InjectionContext as TInjectionContext, Injector as TInjector } from './injector.ts'
import type { Providers as TProviders } from './provider.ts'
import { token } from './token.ts'

export const Context = token<TContext>('Context')
export const InjectionContext = token<TInjectionContext<TContext>>('InjectionContext')
export const Injector = token<TInjector<TContext>>('Injector')
export const Providers = token<TProviders>('Providers')
