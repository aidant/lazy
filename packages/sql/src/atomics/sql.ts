import { DIALECTS, type Dialect } from './dialect.ts'
import { MutableQueryInput, QueryInput } from './query-input.ts'

type Deletable<T> = { -readonly [P in keyof T]?: T[P] }

export const toQueryInput = Symbol.for('toQueryInput')

export interface ToQueryInputOptions {
  readonly dialect: Dialect
  readonly query: MutableQueryInput
}

export class Sql {
  [toQueryInput](_options: ToQueryInputOptions): void {}

  [Symbol.for('nodejs.util.inspect.custom')](
    _depth: number,
    options: object,
    inspect: Function
  ) {
    const mutable = new MutableQueryInput()

    this[toQueryInput]({
      dialect: Object.keys(DIALECTS)[0] as Dialect,
      query: mutable,
    })

    const query = new QueryInput(
      mutable.text,
      mutable.parametersByName,
      mutable.parametersByPosition
    )

    if (!query.text) delete (query as Deletable<QueryInput>).text
    if (!query.parametersByName)
      delete (query as Deletable<QueryInput>).parametersByName
    if (!query.parametersByPosition)
      delete (query as Deletable<QueryInput>).parametersByPosition
    return inspect(query, options)
  }
}

export const NO_SQL = new Sql()
