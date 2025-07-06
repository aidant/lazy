declare const __ref__: unique symbol

export interface TokenDescriptor<T> {
  name: string
  factory: (() => T) | undefined
  value?: T
}

export interface TokenRef<T> {
  [__ref__]: T
}

export interface TokenClass<T> extends Function {
  new (...args: any[]): T
}

export type Token<T> = TokenClass<T> | TokenRef<T>

const TOKEN_DESCRIPTORS = new WeakMap<Token<any>, TokenDescriptor<any>>()

export function token<T>(name: string, factory?: () => T): Token<T> {
  const token = {} as TokenRef<T>

  TOKEN_DESCRIPTORS.set(token, {
    name: name,
    factory,
  })

  return token
}

export function toTokenDescriptor<T>(token: Token<T>): TokenDescriptor<T> {
  let tokenDescriptor = TOKEN_DESCRIPTORS.get(token)

  if (tokenDescriptor) {
    return tokenDescriptor
  }

  token = token as Exclude<typeof token, TokenRef<any>>

  tokenDescriptor = {
    name: token.name,
    factory: undefined,
  }

  TOKEN_DESCRIPTORS.set(token, tokenDescriptor)

  return tokenDescriptor
}
