import type { Sql } from '../mod.ts'
import { SqlLiteral, type SqlLiteralType } from '../sql-classes/sql-literal.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    literal(sql: SqlLiteralType): Sql
  }
}

sql.literal = function literal(literal: SqlLiteralType): Sql {
  return new SqlLiteral(literal)
}
