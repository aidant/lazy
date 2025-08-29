import { syncContextProvider } from './context-provider-sync.ts'
import type { InjectionContext } from './injector.ts'
import type { Context } from './context.ts'

export interface ContextProvider<T> {
  get(): T | undefined
  run<R>(context: T, fn: () => R): R
}

let contextProvider: ContextProvider<any> = syncContextProvider

export function setContextProvider(provider: ContextProvider<any>) {
  contextProvider = provider
}

export function run<TContext extends Context, R>(
  context: InjectionContext<TContext>,
  fn: () => R
): R {
  return contextProvider.run(context, fn)
}

export function getInjectionContext<TContext extends Context>():
  | InjectionContext<TContext>
  | undefined {
  return contextProvider.get()
}
