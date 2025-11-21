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
  static override(
    self: SqlDialect,
    dialects: { readonly [TDialect in Dialect]?: Sql } | undefined,
    fallback?: Sql | undefined
  ): SqlDialect {
    return new SqlDialect(
      dialects
        ? {
            mysql: dialects.mysql || self.#dialects.mysql,
            postgres: dialects.postgres || self.#dialects.postgres,
            snowflake: dialects.snowflake || self.#dialects.snowflake,
            sqlite: dialects.sqlite || self.#dialects.sqlite,
          }
        : self.#dialects,
      fallback || self.#fallback
    )
  }

  readonly #dialects: { readonly [TDialect in Dialect]: Sql | undefined }
  readonly #fallback: Sql | undefined

  constructor(
    dialects: { readonly [TDialect in Dialect]: Sql | undefined },
    fallback?: Sql | undefined
  ) {
    super()
    this.#dialects = dialects
    this.#fallback = fallback
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    ;(this.#dialects[options.dialect] || this.#fallback)?.[toQueryInput](options)
  }

  override [reducer](action: Action): Sql {
    const dialects = {} as { [TDialect in Dialect]: Sql }
    for (const dialect of Object.keys(this.#dialects) as Dialect[]) {
      dialects[dialect] = this.#dialects[dialect]![reducer](action)
    }
    return new SqlDialect(dialects)
  }

  override [toState](options: ToStateOptions, state: State): void {
    ;(this.#dialects[options.dialect] || this.#fallback)?.[toState](options, state)
  }
}
