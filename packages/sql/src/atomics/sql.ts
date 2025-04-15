import { DIALECTS, type Dialect } from './dialect.ts'
import { QueryInputBuilder, type QueryInput } from './query-input.ts'

type Deletable<T> = { -readonly [P in keyof T]?: T[P] }

export const toQueryInput = Symbol.for('toQueryInput')

export interface ToQueryInputOptions {
  readonly dialect: Dialect
  readonly sql: QueryInputBuilder
}

export class Sql {
  [toQueryInput](_options: ToQueryInputOptions): void {}

  [Symbol.for('nodejs.util.inspect.custom')](
    _depth: number,
    options: object,
    inspect: Function
  ) {
    const builder = new QueryInputBuilder()

    this[toQueryInput]({
      dialect: Object.keys(DIALECTS)[0] as Dialect,
      sql: builder,
    })

    const sql = builder.build()

    if (!sql.text) delete (sql as any).text
    if (!sql.parametersByName)
      delete (sql as Deletable<QueryInput>).parametersByName
    if (!sql.parametersByPosition)
      delete (sql as Deletable<QueryInput>).parametersByPosition
    return inspect(sql, options)
  }
}
