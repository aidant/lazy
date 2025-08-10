import {
  type Dependency,
  type DependencyClass,
  type DependencyFactory,
} from './dependency.ts'

export interface ClassInjector<T> {
  inject: Dependency<T>
  useClass: DependencyClass<T>
}

export interface ExistingInjector<T> {
  inject: Dependency<T>
  useExisting: Dependency<T>
}

export interface FactoryInjector<T> {
  inject: Dependency<T>
  useFactory: () => T
}

export interface ValueInjector<T> {
  inject: Dependency<T>
  useValue: T
}

export type Injector<T> =
  | ClassInjector<T>
  | ExistingInjector<T>
  | FactoryInjector<T>
  | ValueInjector<T>

export type DependencyOrInjector<T> = Injector<T> | DependencyFactory<T>

export namespace DependencyOrInjector {
  export type Type<T extends DependencyOrInjector<any>> =
    T extends DependencyOrInjector<infer U> ? U : never
}
