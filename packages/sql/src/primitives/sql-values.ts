import { NUMERIC_PARAMETER_PREFIX } from './sql-dialect-types.ts'
import {
  toSql,
  SqlPrimitive,
  type ToSqlContext,
  type SqlMetaAction,
  reducer,
  type SerializerFn,
} from './sql-primitive.ts'
import { Sql } from './sql.ts'

// TODO: refactor to use SqlFragments such that a SqlPrimitive can be passed to SqlValues
export class SqlValues extends SqlPrimitive {
  readonly #values: readonly unknown[]
  readonly #overrides: Readonly<Record<string, unknown>> | undefined
  readonly #serializers: readonly SerializerFn[] | undefined

  constructor(
    values: readonly unknown[],
    overrides?: Readonly<Record<string, unknown>> | undefined,
    serializers?: readonly SerializerFn[] | undefined
  ) {
    super()
    this.#values = values
    this.#overrides = overrides
    this.#serializers = serializers
  }

  override [toSql](context: ToSqlContext): Sql {
    let parameter = NUMERIC_PARAMETER_PREFIX[context.dialect]

    let text = ''
    let values: Record<string, unknown> | undefined

    for (let index = 0; index < this.#values.length; index++) {
      let value = this.#overrides?.[index + 1] ?? this.#values[index]

      if (this.#serializers) {
        for (const serializer of this.#serializers) {
          value = serializer(value)
        }
      }

      if (index !== 0) text += ', '

      let placeholder = context.values.get(value) || ''

      if (!placeholder) {
        placeholder = `${parameter}${context.values.size + 1}`
        context.values.set(value, placeholder)
        values ||= {}
        values[placeholder] = value
      }

      text += placeholder
    }

    return new Sql(text, values)
  }

  override [reducer](action: SqlMetaAction): SqlPrimitive {
    switch (action.type) {
      case 'bind': {
        return new SqlValues(
          this.#values,
          this.#overrides
            ? { ...this.#overrides, ...action.payload }
            : action.payload,
          this.#serializers
        )
      }
      case 'serialize': {
        return new SqlValues(
          this.#values,
          this.#overrides,
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
