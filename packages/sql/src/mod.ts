import './atomics/sql-as.ts'

import { sql } from './sql-fn.ts'
import { QueryInput } from './atomics/query-input.ts'
import { toQueryInput, Sql } from './atomics/sql.ts'
import type { Dialect } from './atomics/dialect.ts'
import { MutableQueryInput } from './atomics/query-input.ts'

interface Connection {
  (sql: Sql): Promise<any>
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

function postprocess(_sql: Sql, _options: Options, _output: any): any {}

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
