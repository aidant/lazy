import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export type SqlLiteralType = string | number | bigint | boolean | null

export class SqlLiteral extends Sql {
  readonly #literal: SqlLiteralType

  constructor(literal: SqlLiteralType) {
    super()
    this.#literal = literal
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    if (typeof this.#literal === 'string') {
      options.query.text += "'" + this.#literal + "'"
    }

    options.query.text += String(this.#literal)
  }
}
