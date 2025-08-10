import { type Dependency, type DependencyDescriptor } from './dependency.ts'
import { injectImpl, unwrapValue } from './inject.js'
import { type DependencyOrInjector, type Injector } from './injector.ts'
import { toDependency, toDependencyDescriptor, toInjector } from './util.ts'

export type Dependencies = {
  [TPropertyKey in PropertyKey]: DependencyOrInjector<any>
}

export type Scope<TDependencies extends Dependencies = Dependencies> = {
  <T>(token: Dependency<T>): T
} & {
  [TPropertyKey in keyof TDependencies]: DependencyOrInjector.Type<
    TDependencies[TPropertyKey]
  >
}

export interface InitializedScope {
  injectors: WeakMap<DependencyDescriptor<any>, Injector<any>>
  values: WeakMap<DependencyDescriptor<any>, { value: any }>
}

export interface CreateScopeOptinos<TDependencies extends Dependencies> {
  with: TDependencies
}

export const InitializedScope = Symbol()

export function createScope<TDependencies extends Dependencies>(
  options: CreateScopeOptinos<TDependencies>
): Scope<TDependencies> {
  const initializedScope = {
    injectors: new WeakMap(),
    values: new WeakMap(),
  } satisfies InitializedScope

  for (const dependencyOrInjector of Object.values(options.with)) {
    initializedScope.injectors.set(
      toDependencyDescriptor(dependencyOrInjector),
      toInjector(dependencyOrInjector)
    )
  }

  function inject<T>(dependency: Dependency<T>, factory?: () => T): T {
    // @ts-expect-error
    if (dependency === InitializedScope) {
      // @ts-expect-error
      return initializedScope
    }

    const dependencyDescriptor = toDependencyDescriptor(dependency)
    return unwrapValue(
      dependencyDescriptor,
      injectImpl(initializedScope, dependencyDescriptor, factory)
    )
  }

  const properties: PropertyDescriptorMap = {}

  for (const [propertyKey, dependencyOrInjector] of Object.entries(
    options.with
  )) {
    properties[propertyKey] = {
      configurable: true,
      enumerable: true,
      get() {
        return inject(toDependency(dependencyOrInjector))
      },
    }
  }

  return Object.defineProperties(inject, properties) as Scope<TDependencies>
}
