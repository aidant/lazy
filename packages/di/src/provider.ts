import type { Token, TokenClass } from './token.ts'
import { inject } from './inject.ts'

export interface Provider<T> {
  token: Token<T>
  factory: () => T
}

export function useValue<T>(token: Token<T>, value: T): Provider<T> {
  return {
    token,
    factory: () => value,
  }
}

export function useFactory<T>(token: Token<T>, factory: () => T): Provider<T> {
  return {
    token,
    factory,
  }
}

export function useClass<T extends TokenClass<any>>(
  ...args: ConstructorParameters<T> extends [any, ...any[]]
    ? [
        token: Token<InstanceType<T>>,
        constructor: T,
        dependencies: ConstructorParameters<T>,
      ]
    : [token: Token<InstanceType<T>>, constructor: T]
): Provider<InstanceType<T>>
export function useClass<T extends TokenClass<any>>(
  ...args: ConstructorParameters<T> extends [any, ...any[]]
    ? [token: T, dependencies: ConstructorParameters<T>]
    : [token: T]
): Provider<InstanceType<T>>
export function useClass<T extends TokenClass<any>>(
  token: T | Token<InstanceType<T>>,
  constructorOrDependencies?: T | ConstructorParameters<T>,
  dependencies?: ConstructorParameters<T>
): Provider<InstanceType<T>> {
  let constructor: T

  if (Array.isArray(constructorOrDependencies)) {
    constructor = token as T
    dependencies = constructorOrDependencies
  } else if (constructorOrDependencies) {
    constructor = constructorOrDependencies
    dependencies = [] as unknown as ConstructorParameters<T>
  } else {
    constructor = token as T
    dependencies = [] as unknown as ConstructorParameters<T>
  }

  return {
    token,
    factory: () => new constructor(...dependencies),
  }
}

export function useExisting<T>(
  token: Token<T>,
  existing: Token<T>
): Provider<T> {
  return {
    token,
    factory: () => inject(existing),
  }
}
