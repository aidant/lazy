import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export class SqlText extends Sql {
  readonly #text: string

  constructor(text: string) {
    super()
    this.#text = text
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    options.query.text += this.#text
  }
}
