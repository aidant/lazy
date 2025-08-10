declare const ref: unique symbol
declare const factory: unique symbol

export interface DependencyRef<T> {
  [ref]: T
}

export interface DependencyFactory<T> {
  [factory]: T
}

export interface DependencyClass<T> {
  new (): T
}

export type Dependency<T> =
  | DependencyRef<T>
  | DependencyFactory<T>
  | DependencyClass<T>

export namespace Dependency {
  export type Type<TToken extends Dependency<unknown>> =
    TToken extends Dependency<infer T> ? T : never
}

export interface DependencyFactoryDescriptor<T> {
  name: string
  factory: () => T
  value?: T
}

export interface DependencyDescriptor<T> {
  name: string
  factory: (() => T) | undefined
  value?: T
}

export const DEPENDENCY_DESCRIPTORS = new WeakMap<
  Dependency<any>,
  DependencyDescriptor<any>
>()

export function dependency<T>(name: string): DependencyRef<T>
export function dependency<T>(
  name: string,
  factory: () => T
): DependencyFactory<T>
export function dependency<T>(
  name: string,
  factory?: () => T
): DependencyRef<T> | DependencyFactory<T> {
  const ref = {} as DependencyRef<T> | DependencyFactory<T>

  DEPENDENCY_DESCRIPTORS.set(ref, { name, factory })

  return ref
}
