import type { Sql } from '../mod.ts'
import { SqlValue } from '../sql-classes/sql-value.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    value(value: unknown): Sql
  }
}

sql.value = function value(value: unknown): Sql {
  return new SqlValue(undefined, value)
}
