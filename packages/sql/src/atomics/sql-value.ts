import { dialect } from './dialect.js'
import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.js'

export class SqlValue extends Sql {
  #name: string | undefined
  #value: unknown

  constructor(name: string | undefined | null, value: unknown) {
    super()
    this.#name = name || undefined
    this.#value = value
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    if (this.#value instanceof Sql) {
      this.#value[toQueryInput](options)
      return
    }

    if (this.#name) {
      options.query.text +=
        dialect(options.dialect).parameterNamePrefix + this.#name
      options.query.parametersByName ||= {}
      options.query.parametersByName[this.#name] = this.#value
    } else {
      options.query.text += dialect(options.dialect).parameterPositional
      options.query.parametersByPosition ||= []
      options.query.parametersByPosition.push(this.#value)
    }
  }
}
