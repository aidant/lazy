import { EMPTY_SQL, Sql } from './sql.ts'
import {
  getDeserializers,
  reducer,
  SqlPrimitive,
  toSql,
  type DeserializerFn,
  type Deserializers,
  type SqlMetaAction,
  type ToSqlContext,
} from './sql-primitive.ts'
import { QUOTE } from './sql-dialect-types.ts'

export class SqlIdentifier extends SqlPrimitive {
  readonly #identifier: readonly [string, ...string[]]
  readonly #deserializers:
    | readonly [DeserializerFn, ...DeserializerFn[]]
    | undefined

  constructor(
    identifier: string | readonly [string, ...string[]],
    deserializers?: readonly [DeserializerFn, ...DeserializerFn[]] | undefined
  ) {
    super()
    this.#identifier =
      typeof identifier === 'string' ? [identifier] : identifier
    this.#deserializers = deserializers
  }

  override [toSql](context: ToSqlContext): Sql {
    const quote = QUOTE[context.dialect]

    let text = ''

    for (let index = 0; index < this.#identifier.length; index++) {
      const identifier = this.#identifier[index]!

      if (index !== 0) text += '.'

      if (identifier.includes(quote)) {
        text += quote + identifier.replaceAll(quote, quote + quote) + quote
      } else {
        text += quote + identifier + quote
      }
    }

    if (!text) {
      return EMPTY_SQL
    }

    return new Sql(text)
  }

  override [reducer](context: SqlMetaAction): SqlPrimitive {
    switch (context.type) {
      case 'deserialize': {
        return new SqlIdentifier(
          this.#identifier,
          this.#deserializers
            ? [...this.#deserializers, context.payload]
            : [context.payload]
        )
      }
      default: {
        return this
      }
    }
  }

  override [getDeserializers](deserializers: Deserializers): void {
    if (this.#deserializers) {
      deserializers.set(this.#identifier, this.#deserializers)
    }
  }
}
