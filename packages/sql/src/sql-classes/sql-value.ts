import { ParameterNamePrefix, ParameterPositional } from '../dialect.ts'
import { reducer, Sql, toQueryInput, type Action, type ToQueryInputOptions } from './sql.ts'

type Serializer = (value: unknown) => unknown

declare module './sql.ts' {
  interface Actions {
    bind: { readonly [name: string]: unknown }
    serialize: Serializer
  }
}

export class SqlValue extends Sql {
  readonly #name: string | undefined
  readonly #value: unknown
  readonly #serializers: readonly [Serializer, ...Serializer[]] | undefined

  constructor(
    name: string | undefined | null,
    value: unknown,
    serializers?: readonly [Serializer, ...Serializer[]] | undefined | null
  ) {
    super()
    this.#name = name || undefined
    this.#value = value
    this.#serializers = serializers || undefined
  }

  override [toQueryInput](options: ToQueryInputOptions): void {
    if (this.#value instanceof Sql) {
      this.#value[toQueryInput](options)
      return
    }

    const parameterNamePrefix = ParameterNamePrefix[options.dialect]
    const parameterPositional = ParameterPositional[options.dialect]

    if (this.#name && parameterNamePrefix && options.parametersByName !== false) {
      options.query.text += parameterNamePrefix + this.#name
      options.query.parametersByName ||= {}
      options.query.parametersByName[this.#name] = this.#value
    } else {
      options.query.text += parameterPositional
      options.query.parametersByPosition ||= []
      options.query.parametersByPosition.push(this.#value)
    }
  }

  override [reducer](action: Action): Sql {
    if (action.type === 'bind' && this.#name && this.#name in action.payload) {
      return new SqlValue(this.#name, action.payload[this.#name], this.#serializers)
    }

    if (action.type === 'serialize') {
      return new SqlValue(
        this.#name,
        this.#value,
        this.#serializers ? [...this.#serializers, action.payload] : [action.payload]
      )
    }

    return this
  }
}
