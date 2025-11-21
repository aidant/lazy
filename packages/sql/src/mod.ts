import type { Dialect } from './dialect.ts'
import { MutableQueryInput, QueryInput } from './sql-classes/query-input.ts'
import type { Deserializer } from './sql-classes/sql-identifier.ts'
import { Sql, toQueryInput, toState } from './sql-classes/sql.ts'
import { sql } from './sql-functions/sql.ts'

import './sql-functions/sql-as.ts'
import './sql-functions/sql-bind.ts'
import './sql-functions/sql-deserialize.ts'
import './sql-functions/sql-dialect.ts'
import './sql-functions/sql-identifier.ts'
import './sql-functions/sql-inspect.ts'
import './sql-functions/sql-join.ts'
import './sql-functions/sql-placeholder.ts'
import './sql-functions/sql-placeholders.ts'
import './sql-functions/sql-raw.ts'
import './sql-functions/sql-value.ts'
import './sql-functions/sql-values.ts'

interface Connection {
  query(sql: Sql): Promise<unknown>
  [Symbol.asyncDispose](): Promise<void>
}

interface Options {
  readonly dialect: Dialect
  readonly parametersByName?: boolean
}

function preprocess(sql: Sql, options: Options): QueryInput {
  const mutable = new MutableQueryInput()
  sql[toQueryInput]({
    dialect: options.dialect,
    parametersByName: options.parametersByName ?? true,
    query: mutable,
  })
  return new QueryInput(mutable.text, mutable.parametersByName, mutable.parametersByPosition)
}

function postprocess(
  sql: Sql,
  options: Options,
  rows: readonly { [key: string]: unknown }[]
): void {
  return

  const deserializers = new Map<
    readonly [string, ...string[]],
    readonly [Deserializer, ...Deserializer[]]
  >()
  sql[toState](options, { deserializers: deserializers })

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      let value: any = row[key]!

      for (const [id, d] of deserializers) {
        if (id.at(-1) === key) {
          for (const _d of d) {
            value = _d(value)
          }
        }
      }

      row[key] = value
    }
  }
}

export {
  postprocess,
  preprocess,
  sql,
  type Connection,
  type Dialect,
  type Options,
  type QueryInput,
  type Sql,
}
