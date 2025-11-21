import { SqlFunction } from '../sql-classes/sql-function.ts'
import type { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    fn(fn: string | Sql, args: readonly unknown[] | undefined): Sql
  }
}

sql.fn = function fn(fn, args): Sql {
  return new SqlFunction(fn, args)
}
