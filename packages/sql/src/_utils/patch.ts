type Fn = (this: any, ...args: any[]) => any
type KeyOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T]

export function patch<T, P extends KeyOfType<T, Fn>>(
  object: T,
  property: P,
  value: T[P] extends Fn
    ? (this: ThisParameterType<T[P]>, impl: T[P], ...args: Parameters<T[P]>) => ReturnType<T[P]>
    : never
) {
  const old = object[property]
  object[property] = Object.defineProperties(function (this: any, ...args: any[]): any {
    return (value as Function).call(this, old, ...args)
  }, Object.getOwnPropertyDescriptors(old)) as any
}
