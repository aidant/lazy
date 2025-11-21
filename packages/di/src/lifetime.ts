export const Lifetime = {
  Static: 'static',
  Custom: <T extends string>(name: T) => `custom(${name})` as const,
  Temporary: 'temporary',
} as const
export type Lifetime<T extends string = string> = 'static' | `custom(${T})` | 'temporary'
