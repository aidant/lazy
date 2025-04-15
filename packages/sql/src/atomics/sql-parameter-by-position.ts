import { dialect } from './dialect.ts'
import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export class SqlParamaterByPosition extends Sql {
  #value: unknown

  constructor(value: unknown) {
    super()
    this.#value = value
  }

  override [toQueryInput](options: ToQueryInputOptions) {
    options.sql
      .addText(dialect(options.dialect).parameterPositional)
      .addParameterByPosition(this.#value)
  }
}
