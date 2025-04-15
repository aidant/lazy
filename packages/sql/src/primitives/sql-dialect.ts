import { Sql } from './sql.ts'
import {
  type Deserializers,
  getDeserializers,
  reducer,
  type SqlMetaAction,
  SqlPrimitive,
  toSql,
  type ToSqlContext,
} from './sql-primitive.ts'
import type { SqlDialectName } from './sql-dialect-types.ts'

export class SqlDialect extends SqlPrimitive {
  readonly #dialects: Readonly<Record<SqlDialectName, SqlPrimitive>>

  constructor(dialects: Readonly<Record<SqlDialectName, SqlPrimitive>>) {
    super()
    this.#dialects = dialects
  }

  override [toSql](context: ToSqlContext): Sql {
    return this.#dialects[context.dialect][toSql](context)
  }

  override [reducer](action: SqlMetaAction): SqlPrimitive {
    return new SqlDialect({
      sqlite: this.#dialects.sqlite[reducer](action),
      mysql: this.#dialects.mysql[reducer](action),
      postgresql: this.#dialects.postgresql[reducer](action),
    })
  }

  override [getDeserializers](deserializers: Deserializers): void {
    this.#dialects.sqlite[getDeserializers](deserializers)
    this.#dialects.mysql[getDeserializers](deserializers)
    this.#dialects.postgresql[getDeserializers](deserializers)
  }
}
