import { syncContextProvider } from './context-provider-sync.ts'
import { InitializedScope, type Scope } from './scope.js'

export interface ContextProvider<T> {
  get(): T | undefined
  run<R>(context: T, fn: () => R): R
}

let contextProvider: ContextProvider<any> = syncContextProvider

export function setContextProvider(provider: ContextProvider<any>) {
  contextProvider = provider
}

export function run<R>(context: Scope, fn: () => R): R {
  return contextProvider.run(context(InitializedScope as any), fn)
}

export function getScope(): InitializedScope | undefined {
  return contextProvider.get()
}
