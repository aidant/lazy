import { dialect } from './dialect.ts'
import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export class SqlIdentifier extends Sql {
  #identifier: readonly [string, ...string[]]

  constructor(identifier: readonly [string, ...string[]]) {
    super()
    this.#identifier = identifier
  }

  override [toQueryInput](options: ToQueryInputOptions) {
    const quote = dialect(options.dialect).quote

    for (let index = 0; index < this.#identifier.length; index++) {
      const identifier = this.#identifier[index]!

      if (index !== 0) options.sql.addText('.')

      if (identifier.includes(quote)) {
        options.sql.addText(
          quote + identifier.replaceAll(quote, quote + quote) + quote
        )
      } else {
        options.sql.addText(quote + identifier + quote)
      }
    }
  }
}
