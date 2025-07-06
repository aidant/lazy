import type { Provider } from './provider.ts'
import { toTokenDescriptor, type TokenDescriptor } from './token.ts'

export interface Context {
  inject: <T>(token: TokenDescriptor<T>) => { value: T } | undefined
}

interface CreateContextOptions {
  with: readonly Provider<any>[]
}

export function createContext(options?: CreateContextOptions): Context {
  const factoryMap = new WeakMap<TokenDescriptor<any>, () => any>()
  const valueMap = new WeakMap<TokenDescriptor<any>, { value: any }>()

  if (options?.with) {
    for (const { token, factory } of options.with) {
      const tokenDescriptor = toTokenDescriptor(token)
      factoryMap.set(tokenDescriptor, factory)
    }
  }

  function inject<T>(token: TokenDescriptor<T>) {
    let result = valueMap.get(token)

    if (result) {
      return result
    }

    const factory = factoryMap.get(token)

    if (factory) {
      result = { value: factory() }
      valueMap.set(token, result)
      return result
    }

    if ('value' in token) {
      result = { value: token.value }
      valueMap.set(token, result)
      return result
    }

    if (token.factory) {
      result = { value: token.factory() }
      valueMap.set(token, result)
      return result
    }

    return undefined
  }

  return {
    inject,
  }
}

let currentContext: Context | undefined

export function setContextAsync(fn: () => Context | undefined) {
  getContextAsync = fn
}

export function setContext(context: Context | undefined): Context | undefined {
  let previousContext = currentContext

  currentContext = context

  return previousContext
}

export let getContextAsync: () => Context | undefined

export function getContext(): Context | undefined {
  return getContextAsync?.() || currentContext
}
