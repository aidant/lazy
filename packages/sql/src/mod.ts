import './primitives/sql-primitive-ext.ts'

import { sql } from './sql-fn.ts'
import type { Sql as QueryInput } from './primitives/sql.ts'
import { toSql, type SqlPrimitive as Sql } from './primitives/sql-primitive.ts'
import type { SqlDialectName as Dialect } from './primitives/sql-dialect-types.ts'

interface Connection {
  (sql: Sql): Promise<any>
  [Symbol.asyncDispose](): Promise<void>
}

interface Options {
  dialect: Dialect
}

function preprocess(sql: Sql, options: Options): QueryInput {
  return sql[toSql]({ dialect: options.dialect, values: new Map() })
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
