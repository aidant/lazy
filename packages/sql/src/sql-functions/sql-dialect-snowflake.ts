import { SqlDialect } from '../sql-classes/sql-dialect.ts'
import { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    snowflake(strings: readonly string[], ...values: unknown[]): Sql
  }
}

declare module '../sql-classes/sql.ts' {
  interface Sql {
    snowflake(strings: readonly string[], ...values: unknown[]): Sql
  }
}

Sql.prototype.snowflake = function snowflake(
  strings: readonly string[],
  ...values: unknown[]
): Sql {
  if (this instanceof SqlDialect) {
    return SqlDialect.override(this, { snowflake: sql(strings, ...values) })
  }

  return new SqlDialect({
    mysql: this,
    postgres: this,
    snowflake: sql(strings, ...values),
    sqlite: this,
  })
}

sql.snowflake = function snowflake(strings: readonly string[], ...values: unknown[]): Sql {
  return new SqlDialect({
    mysql: undefined,
    postgres: undefined,
    snowflake: sql(strings, ...values),
    sqlite: undefined,
  })
}
