import type { ContextProvider } from './context-provider.ts'
import { AsyncLocalStorage } from 'node:async_hooks'

const asyncLocalStorage = new AsyncLocalStorage<unknown>()

export const asyncLocalStorageContextProvider = {
  get: () => asyncLocalStorage.getStore(),
  run: (context, fn) => asyncLocalStorage.run(context, fn),
} satisfies ContextProvider<unknown>
