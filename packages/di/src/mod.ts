import {
  Context as ContextImpl,
  InjectionContext as InjectionContextImpl,
  Injector as InjectorImpl,
  Providers as ProvidersImpl,
} from './builtins.ts'
import type { Context as TContext } from './context.ts'
import type { InjectionContext as TInjectionContext, Injector as TInjector } from './injector.ts'
import type { Providers as TProviders } from './provider.ts'

export const Context = ContextImpl
export type Context = TContext
export const InjectionContext = InjectionContextImpl
export type InjectionContext<TContext extends Context> = TInjectionContext<TContext>
export const Injector = InjectorImpl
export type Injector<TContext extends Context> = TInjector<TContext>
export const Providers = ProvidersImpl
export type Providers = TProviders

export { run, setContextProvider, type ContextProvider } from './context-provider.ts'
export { get } from './get.ts'
export { init, type InitOptions } from './init.ts'
export type { InjectorResult } from './injector.ts'
export {
  useClass,
  useClassWithArgs,
  useClassWithContext,
  useFactory,
  useFactoryWithArgs,
  useFactoryWithContext,
  useValue,
} from './provider.ts'
export { token, type Token } from './token.ts'
