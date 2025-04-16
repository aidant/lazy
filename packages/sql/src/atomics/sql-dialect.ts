import type { Dialect } from './dialect.ts'
import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export class SqlDialect extends Sql {
  #dialects: { readonly [dialect: Dialect]: Sql }

  constructor(dialects: { readonly [dialect: Dialect]: Sql }) {
    super()
    this.#dialects = dialects
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    this.#dialects[options.dialect]![toQueryInput](options)
  }
}
