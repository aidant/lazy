import { ParameterPositional } from '../dialect.ts'
import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export class SqlFunction extends Sql {
  readonly #fn: string | Sql
  readonly #args: readonly unknown[] | undefined

  constructor(fn: string | Sql, args: readonly unknown[] | undefined) {
    super()
    this.#fn = fn
    this.#args = args
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    if (typeof this.#fn === 'string') {
      options.query.text += this.#fn
    } else {
      this.#fn[toQueryInput](options)
    }

    options.query.text += '('

    if (this.#args) {
      for (let index = 0; index < this.#args.length; index++) {
        const arg = this.#args[index]

        if (index !== 0) {
          options.query.text += ', '
        }

        if (arg instanceof Sql) {
          arg[toQueryInput](options)
        } else {
          const parameterPositional = ParameterPositional[options.dialect]

          options.query.text += parameterPositional
          options.query.parametersByPosition ||= []
          options.query.parametersByPosition.push(arg)
        }
      }
    }

    options.query.text += ')'
  }
}
