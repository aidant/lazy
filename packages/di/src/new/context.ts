import type { Provider } from '../provider.ts'

export type Context = {
  [TPropertyKey in PropertyKey]: any
}

export interface CreateContextOptions {
  parent?: Context | undefined
  providers?: {
    [TPropertyKey in PropertyKey]: Provider<any, any>
  }
}

const CONFIGURABLE = {
  configurable: true,
}
const ENUMERABLE = {
  enumerable: true,
}

export function createContext(options?: CreateContextOptions): Context {
  let context: Context
  const properties: PropertyDescriptorMap = {}

  if (options?.providers) {
    for (const [propertyKey, provider] of Object.entries(options.providers)) {
      properties[provider.token.symbol] = {
        ...CONFIGURABLE,
        get() {
          const value = provider.factory(this as any)
          Object.defineProperty(context, provider.token.symbol, {
            ...CONFIGURABLE,
            value,
          })
          return value
        },
      }
      properties[propertyKey] = {
        ...CONFIGURABLE,
        ...ENUMERABLE,
        get() {
          return (this as any)[provider.token.symbol]
        },
      }
    }
  }

  context = Object.create(options?.parent || null, properties)

  return context
}
