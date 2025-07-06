import { getContext } from './context.ts'
import { toTokenDescriptor, type Token } from './token.ts'

export interface InjectOptions<T> {
  value?: T
  factory?: () => T
}

export function inject<T>(token: Token<T>, options?: InjectOptions<T>): T {
  const context = getContext()

  const tokenDescriptor = toTokenDescriptor(token)

  const result = context?.inject(tokenDescriptor)

  if (result) {
    return result.value
  }

  if ('value' in tokenDescriptor) {
    return tokenDescriptor.value
  }

  if (tokenDescriptor?.factory) {
    const value = tokenDescriptor.factory()
    tokenDescriptor.value = value
    return value
  }

  if (options && 'value' in options) {
    return options.value
  }

  if (options?.factory) {
    return options.factory()
  }

  throw new Error(
    `The injection token "${tokenDescriptor.name}" is not provided`
  )
}
