import { SqlIdentifier } from '../sql-classes/sql-identifier.ts'
import type { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    identifier(identifier: string | readonly [string, ...string[]]): Sql
  }
}

sql.identifier = function identifier(
  identifier: string | readonly [string, ...string[]]
) {
  return new SqlIdentifier(identifier)
}
