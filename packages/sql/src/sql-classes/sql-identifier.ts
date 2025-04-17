import { Quote } from '../dialect.ts'
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

type Deserializer = (value: unknown) => unknown

declare module './sql.ts' {
  interface Actions {
    deserialize: Deserializer
  }
  interface State {
    deserializers: Map<
      readonly [string, ...string[]],
      readonly [Deserializer, ...Deserializer[]]
    >
  }
}

export class SqlIdentifier extends Sql {
  readonly #identifier: readonly [string, ...string[]]
  readonly #deserializers:
    | readonly [Deserializer, ...Deserializer[]]
    | undefined

  constructor(
    identifier: string | readonly [string, ...string[]],
    deserializers?:
      | readonly [Deserializer, ...Deserializer[]]
      | undefined
      | null
  ) {
    super()
    this.#identifier =
      typeof identifier === 'string' ? [identifier] : identifier
    this.#deserializers = deserializers || undefined
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    const quote = Quote[options.dialect]

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

  override [reducer](action: Action): Sql {
    if (action.type === 'deserialize') {
      return new SqlIdentifier(
        this.#identifier,
        this.#deserializers
          ? [...this.#deserializers, action.payload]
          : [action.payload]
      )
    }

    return this
  }

  override [toState](options: ToStateOptions, state: State): void {
    if (this.#deserializers) {
      state.deserializers.set(this.#identifier, this.#deserializers)
    }
  }
}
