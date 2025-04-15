import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export class SqlText extends Sql {
  #text: string

  constructor(text: string) {
    super()
    this.#text = text
  }

  override [toQueryInput](options: ToQueryInputOptions) {
    options.sql.addText(this.#text)
  }
}
