import { MutableQueryInput, QueryInput } from '../sql-classes/query-input.js'
import { Sql, toQueryInput } from '../sql-classes/sql.ts'

const inspect = Symbol.for('nodejs.util.inspect.custom')

declare module '../sql-classes/sql.ts' {
  interface Sql {
    [inspect](depth: number, options: object, inspect: Function): unknown
  }
}

Sql.prototype[inspect] = function (
  _depth: number,
  options: object,
  inspect: Function
): unknown {
  const mutable = new MutableQueryInput()

  this[toQueryInput]({
    dialect: 'sqlite',
    query: mutable,
  })

  const query = new QueryInput(
    mutable.text,
    mutable.parametersByName,
    mutable.parametersByPosition
  )

  type Deletable<T> = { -readonly [P in keyof T]?: T[P] }

  if (!query.text) delete (query as Deletable<QueryInput>).text
  if (!query.parametersByName)
    delete (query as Deletable<QueryInput>).parametersByName
  if (!query.parametersByPosition)
    delete (query as Deletable<QueryInput>).parametersByPosition
  return inspect(query, options)
}
