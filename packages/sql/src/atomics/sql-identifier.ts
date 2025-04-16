import { dialect } from './dialect.ts'
import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export class SqlIdentifier extends Sql {
  #identifier: readonly [string, ...string[]]

  constructor(identifier: string | readonly [string, ...string[]]) {
    super()
    this.#identifier =
      typeof identifier === 'string' ? [identifier] : identifier
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    const quote = dialect(options.dialect).quote

    for (let index = 0; index < this.#identifier.length; index++) {
      const identifier = this.#identifier[index]!

      if (index !== 0) options.query.text += '.'

      if (identifier.includes(quote)) {
        options.query.text +=
          quote + identifier.replaceAll(quote, quote + quote) + quote
      } else {
        options.query.text += quote + identifier + quote
      }
    }
  }
}
