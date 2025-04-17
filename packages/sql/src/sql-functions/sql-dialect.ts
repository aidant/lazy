import type { Dialect } from '../dialect.ts'
import { SqlDialect } from '../sql-classes/sql-dialect.ts'
import type { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    dialect(dialects: { readonly [TDialect in Dialect]: Sql }): Sql
  }
}

sql.dialect = function dialect(dialects: {
  readonly [TDialect in Dialect]: Sql
}): Sql {
  return new SqlDialect(dialects)
}
