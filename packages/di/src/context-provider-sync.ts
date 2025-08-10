import type { ContextProvider } from './context-provider.ts'

let currentContext: unknown

export const syncContextProvider = {
  get: () => currentContext,
  run: (context, fn) => {
    const previousContext = currentContext
    currentContext = context
    try {
      return fn()
    } finally {
      currentContext = previousContext
    }
  },
} satisfies ContextProvider<unknown>
