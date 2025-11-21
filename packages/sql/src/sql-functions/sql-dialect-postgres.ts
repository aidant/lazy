import { SqlDialect } from '../sql-classes/sql-dialect.ts'
import { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    postgres(strings: readonly string[], ...values: unknown[]): Sql
  }
}

declare module '../sql-classes/sql.ts' {
  interface Sql {
    postgres(strings: readonly string[], ...values: unknown[]): Sql
  }
}

Sql.prototype.postgres = function postgres(strings: readonly string[], ...values: unknown[]): Sql {
  if (this instanceof SqlDialect) {
    return SqlDialect.override(this, { postgres: sql(strings, ...values) })
  }

  return new SqlDialect({
    mysql: this,
    postgres: sql(strings, ...values),
    snowflake: this,
    sqlite: this,
  })
}

sql.postgres = function postgres(strings: readonly string[], ...values: unknown[]): Sql {
  return new SqlDialect({
    mysql: undefined,
    postgres: sql(strings, ...values),
    snowflake: undefined,
    sqlite: undefined,
  })
}
