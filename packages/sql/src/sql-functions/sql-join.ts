import { SqlFragments } from '../sql-classes/sql-fragments.ts'
import type { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    join(fragments: Sql[], separator: Sql): Sql
  }
}

sql.join = function join(fragments: Sql[], separator: Sql): Sql {
  return new SqlFragments(fragments, separator)
}
