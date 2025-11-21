import {
  reducer,
  Sql,
  toQueryInput,
  toState,
  type Action,
  type State,
  type ToQueryInputOptions,
  type ToStateOptions,
} from '../sql-classes/sql.ts'

export interface SelectStatementState {}

export class SelectStatement extends Sql {
  #state: SelectStatementState

  constructor(
    newState: Partial<SelectStatementState>,
    oldState: SelectStatement
  )
  constructor(state: SelectStatementState)
  constructor(
    newState: SelectStatementState,
    oldState?: SelectStatement | undefined | null
  ) {
    super()
    if (oldState) {
      this.#state = { ...oldState.#state, ...newState }
    } else {
      this.#state = newState
    }
  }

  override [toQueryInput](options: ToQueryInputOptions): void {}
  override [reducer](_action: Action): Sql {
    return this
  }
  override [toState](_options: ToStateOptions, _state: State): void {}
}
