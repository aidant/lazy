import type { Dialect } from '../dialect.ts'
import {
  reducer,
  Sql,
  toState,
  toQueryInput,
  type Action,
  type State,
  type ToQueryInputOptions,
  type ToStateOptions,
} from './sql.ts'

export class SqlDialect extends Sql {
  readonly #dialects: { readonly [TDialect in Dialect]: Sql }

  constructor(dialects: { readonly [TDialect in Dialect]: Sql }) {
    super()
    this.#dialects = dialects
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    this.#dialects[options.dialect][toQueryInput](options)
  }

  override [reducer](action: Action): Sql {
    const dialects = {} as { [TDialect in Dialect]: Sql }
    for (const dialect of Object.keys(this.#dialects) as Dialect[]) {
      dialects[dialect] = this.#dialects[dialect]![reducer](action)
    }
    return new SqlDialect(dialects)
  }

  override [toState](options: ToStateOptions, state: State): void {
    this.#dialects[options.dialect][toState](options, state)
  }
}
