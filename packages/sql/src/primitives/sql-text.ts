import { Sql } from './sql.ts'
import {
  toSql,
  SqlPrimitive,
  type ToSqlContext,
  reducer,
  type SqlMetaAction,
  type SerializerFn,
} from './sql-primitive.ts'

export class SqlText extends SqlPrimitive {
  readonly #text: string
  readonly #values: Readonly<Record<string, unknown>> | undefined
  readonly #serializers: readonly SerializerFn[] | undefined

  constructor(
    text: string,
    values?: Readonly<Record<string, unknown>> | undefined,
    serializers?: readonly SerializerFn[] | undefined
  ) {
    super()
    this.#text = text
    this.#values = values
    this.#serializers = serializers
  }

  override [toSql](_context: ToSqlContext): Sql {
    let values: Record<string, unknown> | undefined

    if (this.#values && !this.#serializers) {
      values = this.#values
    } else if (this.#values && this.#serializers) {
      for (const key of Object.keys(this.#values)) {
        let value: unknown = this.#values[key]!

        for (const serializer of this.#serializers) {
          value = serializer(value)
        }

        values ||= {}
        values[key] = value
      }
    }

    return new Sql(this.#text, values)
  }

  override [reducer](action: SqlMetaAction): SqlPrimitive {
    switch (action.type) {
      case 'bind': {
        let values: Record<string, unknown> | undefined

        for (const key of Object.keys(action.payload)) {
          const value = action.payload[key]!

          const regex = new RegExp(
            // TODO: remove fallback
            `(?<prefix>[?@$:])${(RegExp as any).escape?.(key) || key}(?=\s|[^a-zA-Z0-9_]|$)`,
            'g'
          )
          for (
            let match = regex.exec(this.#text);
            match !== null;
            match = regex.exec(this.#text)
          ) {
            if (!values) {
              values = this.#values ? { ...this.#values } : {}
            }
            values[match.groups!['prefix'] + key] = value
          }
        }

        if (!values) {
          return this
        }

        return new SqlText(this.#text, values, this.#serializers)
      }
      case 'serialize': {
        return new SqlText(
          this.#text,
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
