export interface Token<T> {
  description?: string
  factory?: () => T
}

export namespace Token {
  export type Type<TToken extends Token<unknown>> = TToken extends {
    factory?: () => infer T
  }
    ? T
    : never
}

export function token<T>(description?: string, factory?: () => T): Token<T> {
  const token: Token<T> = {}

  if (description) {
    token.description = description
  }

  if (factory) {
    token.factory = factory
  }

  return token
}
