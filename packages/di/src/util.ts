import {
  DEPENDENCY_DESCRIPTORS,
  type Dependency,
  type DependencyDescriptor,
  type DependencyFactory,
  type DependencyFactoryDescriptor,
  type DependencyRef,
} from './dependency.ts'
import type { DependencyOrInjector, Injector } from './injector.ts'

export function toDependency<T>(
  dependencyOrInjector: Dependency<T> | Injector<T> | DependencyOrInjector<T>
): Dependency<T> {
  if ('inject' in dependencyOrInjector) {
    return dependencyOrInjector.inject
  }

  return dependencyOrInjector
}

export function toDependencyDescriptor<T>(
  dependency: DependencyFactory<T>
): DependencyFactoryDescriptor<T>
export function toDependencyDescriptor<T>(
  injector: Injector<T> | DependencyOrInjector<T>
): DependencyFactoryDescriptor<T>
export function toDependencyDescriptor<T>(
  dependency: Dependency<T>
): DependencyDescriptor<T>
export function toDependencyDescriptor<T>(
  dependencyOrInjector: Dependency<T> | Injector<T> | DependencyOrInjector<T>
): DependencyDescriptor<T> {
  let dependency =
    'inject' in dependencyOrInjector
      ? dependencyOrInjector.inject
      : dependencyOrInjector
  let dependencyDescriptor = DEPENDENCY_DESCRIPTORS.get(dependency)

  if (dependencyDescriptor) {
    return dependencyDescriptor
  }

  dependency = dependency as Exclude<
    typeof dependency,
    DependencyRef<T> | DependencyFactory<T>
  >

  dependencyDescriptor = {
    name: dependency.name,
    factory: undefined,
  }

  return dependencyDescriptor
}

export function toInjector<T>(
  dependencyOrInjector: DependencyOrInjector<T>
): Injector<T> {
  if ('inject' in dependencyOrInjector) {
    return dependencyOrInjector
  }

  return {
    inject: dependencyOrInjector,
    useFactory: toDependencyDescriptor(dependencyOrInjector).factory,
  }
}
