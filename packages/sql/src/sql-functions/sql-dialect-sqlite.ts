import { SqlDialect } from '../sql-classes/sql-dialect.ts'
import { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    sqlite(strings: readonly string[], ...values: unknown[]): Sql
  }
}

declare module '../sql-classes/sql.ts' {
  interface Sql {
    sqlite(strings: readonly string[], ...values: unknown[]): Sql
  }
}

Sql.prototype.sqlite = function sqlite(strings: readonly string[], ...values: unknown[]): Sql {
  if (this instanceof SqlDialect) {
    return SqlDialect.override(this, { sqlite: sql(strings, ...values) })
  }

  return new SqlDialect({
    mysql: this,
    postgres: this,
    snowflake: this,
    sqlite: sql(strings, ...values),
  })
}

sql.sqlite = function sqlite(strings: readonly string[], ...values: unknown[]): Sql {
  return new SqlDialect({
    mysql: undefined,
    postgres: undefined,
    snowflake: undefined,
    sqlite: sql(strings, ...values),
  })
}
