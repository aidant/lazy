import { getInjectionContext } from './context-provider.ts'

export interface Token<T> {
  symbol: symbol
  factory?: () => T
  value?: T
}

export namespace Token {
  export type Type<TToken extends Token<unknown>> = TToken extends {
    factory?: () => infer T
  }
    ? T
    : never
}

type Primitive = string | number | bigint | boolean | undefined | symbol | null

export interface OptionalDependency<T> {
  (): T | undefined
  'new'(): T | undefined
}

export interface Dependency<T> extends Token<T> {
  (): T
  new (): T extends Primitive ? never : T
  'new'(): T
  optional: OptionalDependency<T>
}

interface GetOptions {
  new?: boolean
  newKeyword?: boolean
  optional?: boolean
}

function get<T>(token: Token<T>, options?: GetOptions) {
  const injectionContext = getInjectionContext()

  if (!injectionContext) {
    if (options?.optional) {
      return undefined
    } else {
      throw new Error(`Unable to get "${token.name}"`)
    }
  }

  const result = injectionContext.injector.get(token)

  if ('value' in result) {
    return result.value
  }

  throw new Error(`Unable to get "${token.name}"`)
}

export interface TokenOptions<T> {
  name?: string
  factory?: () => T
  unique?: boolean
}

export function token<T>(): Dependency<T>
export function token<T>(options: TokenOptions<T>): Dependency<T>
export function token<T>(name: string): Dependency<T>
export function token<T>(name: string, factory: () => T): Dependency<T>
export function token<T>(factory: () => T): Dependency<T>
export function token<T>(
  arg1?: TokenOptions<T> | string | (() => T),
  arg2?: () => T
): Dependency<T> {
  const name = typeof arg1 === 'object' ? arg1.name : typeof arg1 === 'string' ? arg1 : undefined
  const factory =
    typeof arg1 === 'object'
      ? arg1.factory
      : typeof arg1 === 'function'
        ? arg1
        : typeof arg2 === 'function'
          ? arg2
          : undefined
  const unique = typeof arg1 === 'object' ? arg1.unique : undefined

  const dependency: any = function (this: any) {
    return get(dependency, { newKeyword: this instanceof dependency })
  }
  dependency.new = () => {
    return get(dependency, { new: true })
  }
  dependency.optional = () => {
    return get(dependency, { optional: true })
  }
  dependency.optional.new = () => {
    return get(dependency, { optional: true, new: true })
  }

  if (name) {
    Object.defineProperty(dependency, 'name', { value: name, configurable: true })
  }

  if (factory) {
    dependency.factory = factory
  }

  if (unique ?? true) {
    dependency.symbol = Symbol(name || '')
  } else {
    dependency.symbol = Symbol.for(name || '')
  }

  dependency[Symbol.toPrimitive] = () => {
    return dependency.symbol
  }

  return dependency
}
