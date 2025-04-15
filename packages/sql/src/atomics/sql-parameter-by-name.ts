import { dialect } from './dialect.ts'
import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export class SqlParamaterByName extends Sql {
  #name: string
  #value: unknown

  constructor(name: string, value: unknown) {
    super()
    this.#name = name
    this.#value = value
  }

  override [toQueryInput](options: ToQueryInputOptions) {
    options.sql
      .addText(dialect(options.dialect).parameterNamePrefix + this.#name)
      .addParameterByName(this.#name, this.#value)
  }
}
