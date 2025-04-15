import {
  NUMERIC_PARAMETER_PREFIX,
  VARIABLE_PARAMETER_PREFIX,
} from './sql-dialect-types.ts'
import {
  toSql,
  SqlPrimitive,
  type ToSqlContext,
  reducer,
  type SqlMetaAction,
  type SerializerFn,
} from './sql-primitive.ts'
import { Sql } from './sql.ts'

export class SqlPlaceholders extends SqlPrimitive {
  readonly #placeholders: readonly [string, ...string[]]
  readonly #values: Readonly<Record<string, unknown>> | undefined
  readonly #serializers: readonly SerializerFn[] | undefined

  constructor(
    placeholders: readonly [string, ...string[]],
    values?: Readonly<Record<string, unknown>> | undefined,
    serializers?: readonly SerializerFn[] | undefined
  ) {
    super()
    this.#placeholders = placeholders
    this.#values = values
    this.#serializers = serializers
  }

  override [toSql](context: ToSqlContext): Sql {
    let variable = VARIABLE_PARAMETER_PREFIX[context.dialect]
    let numeric = NUMERIC_PARAMETER_PREFIX[context.dialect]

    let text = ''

    for (let index = 0; index < this.#placeholders.length; index++) {
      const placeholder = this.#placeholders[index]!
      const parameter = /^\d+$/.test(placeholder) ? numeric : variable

      if (index !== 0) text += ', '

      text += `${parameter}${placeholder}`
    }

    let values: Record<string, unknown> | undefined

    if (this.#values) {
      for (const key of Object.keys(this.#values)) {
        if (!this.#placeholders.includes(key)) {
          continue
        }

        let value: unknown = this.#values[key]!

        if (this.#serializers) {
          for (const serializer of this.#serializers) {
            value = serializer(value)
          }
        }

        const parameter = /^\d+$/.test(key) ? numeric : variable

        values ||= {}
        values[`${parameter}${key}`] = value
      }
    }

    return new Sql(text, values)
  }

  override [reducer](action: SqlMetaAction): SqlPrimitive {
    switch (action.type) {
      case 'bind': {
        return new SqlPlaceholders(
          this.#placeholders,
          this.#values
            ? { ...this.#values, ...action.payload }
            : action.payload,
          this.#serializers
        )
      }
      case 'serialize': {
        return new SqlPlaceholders(
          this.#placeholders,
          this.#values,
          this.#serializers
            ? [...this.#serializers, action.payload]
            : [action.payload]
        )
      }
      default: {
        return this
      }
    }
  }
}
