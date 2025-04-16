import { Sql, toQueryInput, type ToQueryInputOptions } from './sql.ts'

export class SqlFragments extends Sql {
  readonly #fragments: readonly Sql[] = []
  readonly #separator: string | Sql | undefined

  constructor(
    fragments: readonly Sql[],
    separator?: string | Sql | undefined | null
  ) {
    super()
    this.#fragments = fragments
    this.#separator = separator || undefined
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    for (let index = 0; index < this.#fragments.length; index++) {
      const fragment = this.#fragments[index]!

      if (index !== 0 && this.#separator) {
        if (this.#separator instanceof Sql) {
          this.#separator[toQueryInput](options)
        } else {
          options.query.text += this.#separator
        }
      }

      fragment[toQueryInput](options)
    }
  }
}
