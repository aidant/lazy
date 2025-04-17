import {
  reducer,
  Sql,
  toState,
  toQueryInput,
  type Action,
  type State,
  type ToQueryInputOptions,
  type ToStateOptions,
} from './sql.ts'

const Separator = new Set([
  '',
  ' ',
  ',',
  ', ',
  ' and ',
  ' or ',
  ') and (',
  ') or (',
  ';',
  '; ',
])
export type Separator = typeof Separator extends Set<infer T> ? T : never

export class SqlFragments extends Sql {
  readonly #fragments: readonly Sql[] = []
  readonly #separator: Separator | Sql | undefined

  constructor(
    fragments: readonly Sql[],
    separator?: Separator | Sql | undefined | null
  ) {
    if (typeof separator === 'string' && !Separator.has(separator)) {
      throw new Error(
        `The separator "${separator}" is not included in the list of allowed separators: "${[...Separator].join('", "')}"`
      )
    }

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

  override [reducer](action: Action): Sql {
    const fragments: Sql[] = []

    for (const fragment of this.#fragments) {
      fragments.push(fragment[reducer](action))
    }

    return new SqlFragments(
      fragments,
      this.#separator instanceof Sql
        ? this.#separator[reducer](action)
        : this.#separator
    )
  }

  override [toState](options: ToStateOptions, state: State): void {
    for (const fragment of this.#fragments) {
      fragment[toState](options, state)
    }

    if (this.#separator instanceof Sql) {
      this.#separator[toState](options, state)
    }
  }
}
