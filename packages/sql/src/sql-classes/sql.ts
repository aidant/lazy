import type { Dialect } from '../dialect.ts'
import { MutableQueryInput } from './query-input.ts'

export const toQueryInput = Symbol.for('toQueryInput')
export const reducer = Symbol.for('reducer')
export const toState = Symbol.for('toState')

export interface ToQueryInputOptions {
  readonly dialect: Dialect
  readonly parametersByName: boolean
  readonly query: MutableQueryInput
}

export interface Actions {}
export type Action = {
  [Action in keyof Actions]: { type: Action; payload: Actions[Action] }
}[keyof Actions]

export interface ToStateOptions {
  dialect: Dialect
}

export interface State {}

export abstract class Sql {
  abstract [toQueryInput](_options: ToQueryInputOptions): void
  [reducer](_action: Action): Sql {
    return this
  }
  [toState](_options: ToStateOptions, _state: State): void {}
}
