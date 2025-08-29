import { getInjectionContext } from './context-provider.ts'
import type { InjectorOptions } from './injector.ts'
import type { Token } from './token.ts'

export function get<T>(token: Token<T>, options?: InjectorOptions): T {
  const injectionContext = getInjectionContext()

  if (!injectionContext) {
    if (options?.optional) {
      return undefined as T
    } else {
      throw new Error(`Unable to get "${token.description}"`)
    }
  }

  return injectionContext.injector.get(token, options)
}
