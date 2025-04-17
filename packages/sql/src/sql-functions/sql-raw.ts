import type { Sql } from '../mod.ts'
import { SqlText } from '../sql-classes/sql-text.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    raw(sql: string): Sql
  }
}

sql.raw = function raw(sql: string): Sql {
  return new SqlText(sql)
}
