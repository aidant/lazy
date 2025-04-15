import { EMPTY_SQL, Sql } from './sql.ts'
import {
  toSql,
  SqlPrimitive,
  type ToSqlContext,
  reducer,
  type SqlMetaAction,
  getDeserializers,
  type Deserializers,
} from './sql-primitive.ts'

export class SqlFragments extends SqlPrimitive {
  readonly #fragments: readonly SqlPrimitive[]
  readonly #separator: string | SqlPrimitive

  constructor(
    fragments: readonly SqlPrimitive[],
    separator: string | SqlPrimitive = ''
  ) {
    super()
    this.#fragments = fragments
    this.#separator = separator
  }

  override [toSql](context: ToSqlContext): Sql {
    if (this.#fragments.length === 0) {
      return EMPTY_SQL
    }

    let text = ''
    let values: Record<string, unknown> | undefined

    for (let index = 0; index < this.#fragments.length; index++) {
      const fragment = this.#fragments[index]!

      const sql = fragment[toSql](context)

      if (index !== 0 && this.#separator) {
        if (this.#separator instanceof SqlPrimitive) {
          const sql = this.#separator[toSql](context)

          text += sql.text
          if (sql.values) {
            values ||= {}
            Object.assign(values, sql.values)
          }
        } else {
          text += this.#separator
        }
      }

      text += sql.text
      if (sql.values) {
        values ||= {}
        Object.assign(values, sql.values)
      }
    }

    if (!text && !values) {
      return EMPTY_SQL
    }

    return new Sql(text, values)
  }

  override [reducer](action: SqlMetaAction): SqlPrimitive {
    const fragments: SqlPrimitive[] = []

    for (const fragment of this.#fragments) {
      fragments.push(fragment[reducer](action))
    }

    return new SqlFragments(
      fragments,
      typeof this.#separator === 'string'
        ? this.#separator
        : this.#separator[reducer](action)
    )
  }

  override [getDeserializers](deserializers: Deserializers): void {
    for (const fragment of this.#fragments) {
      fragment[getDeserializers](deserializers)
    }

    if (this.#separator instanceof SqlPrimitive) {
      this.#separator[getDeserializers](deserializers)
    }
  }
}
