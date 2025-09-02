import type { Context, ContextFromProviders } from './context.ts'
import type { InjectionContext } from './injector.ts'
import type { Token } from './token.ts'

export interface Provider<T, TContext extends Context> {
  token: Token<T>
  factory: (injectionContext: InjectionContext<TContext>) => T
  value?: T
}

export namespace Provider {
  export type Type<TProvider extends Provider<unknown, any>> = TProvider extends { value?: infer T }
    ? T
    : never
}

export type Providers<
  TProviders extends Record<PropertyKey, Provider<unknown, any>> = {},
  TParentProviders extends Record<PropertyKey, Provider<unknown, any>> = {},
> = {
  [K: PropertyKey]: Provider<unknown, ContextFromProviders<TProviders, TParentProviders>>
}

export function useFactory<T>(token: Token<T>, factory: () => T): Provider<T, {}> {
  return {
    token,
    factory: () => factory(),
  }
}

export function useFactoryWithContext<T, TContext extends Context>(
  token: Token<T>,
  factory: (context: TContext) => T
): Provider<T, TContext> {
  return {
    token,
    factory: (injectionContext) => factory(injectionContext.context),
  }
}

export function useFactoryWithArgs<T, TArgs extends readonly [Token<unknown>, ...Token<unknown>[]]>(
  token: Token<T>,
  factory: (...args: { [Index in keyof TArgs]: Token.Type<TArgs[Index]> }) => T,
  args: TArgs
): Provider<T, {}> {
  return {
    token,
    factory: (injectionContext) =>
      factory(
        ...(args.map((token) => injectionContext.injector.get(token).unwrap()) as {
          [Index in keyof TArgs]: Token.Type<TArgs[Index]>
        })
      ),
  }
}

export function useValue<T>(token: Token<T>, value: T): Provider<T, {}> {
  return {
    token,
    factory: () => value,
    value,
  }
}

export function useClass<T>(token: Token<T>, constructor: new () => T): Provider<T, {}> {
  return {
    token,
    factory: () => new constructor(),
  }
}

export function useClassWithContext<T, TContext extends Context>(
  token: Token<T>,
  constructor: new (context: TContext) => T
): Provider<T, TContext> {
  return {
    token,
    factory: (injectionContext) => new constructor(injectionContext.context),
  }
}

export function useClassWithArgs<T, TArgs extends readonly [Token<unknown>, ...Token<unknown>[]]>(
  token: Token<T>,
  constructor: new (...args: { [Index in keyof TArgs]: Token.Type<TArgs[Index]> }) => T,
  args: TArgs
): Provider<T, {}> {
  return {
    token,
    factory: (injectionContext) =>
      new constructor(
        ...(args.map((token) => injectionContext.injector.get(token).unwrap()) as {
          [Index in keyof TArgs]: Token.Type<TArgs[Index]>
        })
      ),
  }
}
