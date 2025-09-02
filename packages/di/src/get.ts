import { getInjectionContext } from './context-provider.ts'
import type { InjectorResult } from './injector.ts'
import type { Token } from './token.ts'

export function get<T>(token: Token<T>): InjectorResult<T> {
  const injectionContext = getInjectionContext()

  if (!injectionContext) {
    return {
      unwrap: () => {
        throw new Error(`Unable to get "${token.description}"`)
      },
    }
  }

  return injectionContext.injector.get(token)
}
