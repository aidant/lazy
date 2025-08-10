import type { ContextProvider } from './context-provider.ts'

declare const AsyncContext: {
  Variable: {
    new <T>(): {
      get(): T | undefined
      run<R>(value: T, fn: () => R): R
    }
  }
}

export const contextAsync = new AsyncContext.Variable<unknown>()

export const asyncContextProvider = {
  get: () => contextAsync.get(),
  run: (context, fn) => contextAsync.run(context, fn),
} satisfies ContextProvider<unknown>
