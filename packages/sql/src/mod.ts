import { sql } from './sql-functions/sql.ts'
import { QueryInput } from './sql-classes/query-input.ts'
import { toQueryInput, Sql, toState } from './sql-classes/sql.ts'
import { MutableQueryInput } from './sql-classes/query-input.ts'
import type { Dialect } from './dialect.ts'

import './sql-functions/sql-as.ts'
import './sql-functions/sql-bind.ts'
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
  (sql: Sql): Promise<unknown>
  [Symbol.asyncDispose](): Promise<void>
}

interface Options {
  dialect: Dialect
}

function preprocess(sql: Sql, options: Options): QueryInput {
  const mutable = new MutableQueryInput()
  sql[toQueryInput]({ dialect: options.dialect, query: mutable })
  return new QueryInput(
    mutable.text,
    mutable.parametersByName,
    mutable.parametersByPosition
  )
}

function postprocess(sql: Sql, options: Options, output: unknown): unknown {
  const state = sql[toState](options, { deserializers: new Map() })
}

export {
  sql,
  type QueryInput,
  type Sql,
  type Dialect,
  type Options,
  type Connection,
  preprocess,
  postprocess,
}
