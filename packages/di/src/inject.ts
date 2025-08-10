import { getScope } from './context-provider.ts'
import { type Dependency, type DependencyDescriptor } from './dependency.ts'
import type { InitializedScope } from './scope.ts'
import { toDependencyDescriptor } from './util.ts'

export function injectImpl<T>(
  initializedScope: InitializedScope | undefined,
  dependencyDescriptor: DependencyDescriptor<T>,
  factory?: () => T
): { value: T } | undefined {
  let result = initializedScope?.values.get(dependencyDescriptor)

  if (result) {
    return result
  }

  const injector = initializedScope?.injectors.get(dependencyDescriptor)

  if (injector) {
    if ('useValue' in injector) {
      result = { value: injector.useValue }
    } else if ('useFactory' in injector) {
      result = { value: injector.useFactory() }
    } else if ('useClass' in injector) {
      result = { value: new injector.useClass() }
    } else if ('useExisting' in injector) {
      result = injectImpl(
        initializedScope,
        toDependencyDescriptor(injector.useExisting)
      )
    }

    if (!result) {
      return undefined
    }

    initializedScope!.values.set(dependencyDescriptor, result)
    return result
  }

  if ('value' in dependencyDescriptor) {
    result = { value: dependencyDescriptor.value }
    initializedScope?.values.set(dependencyDescriptor, result)
    return result
  }

  if (dependencyDescriptor.factory) {
    result = { value: dependencyDescriptor.factory() }
    if (!initializedScope) {
      dependencyDescriptor.value = result.value
    }
    initializedScope?.values.set(dependencyDescriptor, result)
    return result
  }

  if (factory) {
    result = { value: factory() }
    return result
  }

  return undefined
}

export function unwrapValue<T>(
  dependencyDescriptor: DependencyDescriptor<T>,
  result: { value: T } | undefined
): T {
  if (!result) {
    throw new Error(
      `The dependency "${dependencyDescriptor.name}" is not injected`
    )
  }

  return result.value
}

export function inject<T>(dependency: Dependency<T>, factory?: () => T): T {
  const dependencyDescriptor = toDependencyDescriptor(dependency)
  return unwrapValue(
    dependencyDescriptor,
    injectImpl(getScope(), dependencyDescriptor, factory)
  )
}
