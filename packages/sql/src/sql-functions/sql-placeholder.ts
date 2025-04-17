import { SqlValue } from '../sql-classes/sql-value.ts'
import type { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    placeholder(placeholder?: string | undefined | null): Sql
  }
}

sql.placeholder = function placeholder(
  placeholder?: string | undefined | null
): Sql {
  return new SqlValue(placeholder, undefined)
}
