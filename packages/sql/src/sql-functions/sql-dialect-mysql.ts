import { SqlDialect } from '../sql-classes/sql-dialect.ts'
import { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    mysql(strings: readonly string[], ...values: unknown[]): Sql
  }
}

declare module '../sql-classes/sql.ts' {
  interface Sql {
    mysql(strings: readonly string[], ...values: unknown[]): Sql
  }
}

Sql.prototype.mysql = function mysql(strings: readonly string[], ...values: unknown[]): Sql {
  if (this instanceof SqlDialect) {
    return SqlDialect.override(this, { mysql: sql(strings, ...values) })
  }

  return new SqlDialect({
    mysql: sql(strings, ...values),
    postgres: this,
    snowflake: this,
    sqlite: this,
  })
}

sql.mysql = function mysql(strings: readonly string[], ...values: unknown[]): Sql {
  return new SqlDialect({
    mysql: sql(strings, ...values),
    postgres: undefined,
    snowflake: undefined,
    sqlite: undefined,
  })
}
