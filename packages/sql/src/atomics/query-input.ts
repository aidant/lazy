export class QueryInputBuilder {
  #text: string = ''
  #parametersByName: { [value: string]: unknown } | undefined
  #parametersByPosition: unknown[] | undefined

  addText(text: string): this {
    this.#text += text
    return this
  }

  addParameterByName(name: string, value: unknown): this {
    this.#parametersByName ||= {}
    this.#parametersByName[name] = value
    return this
  }

  addParameterByPosition(value: unknown): this {
    this.#parametersByPosition ||= []
    this.#parametersByPosition.push(value)
    return this
  }

  build(): QueryInput {
    if (!this.#text && !this.#parametersByName && !this.#parametersByPosition) {
      return NO_QUERY_INPUT
    }

    return new QueryInput(
      this.#text,
      this.#parametersByName,
      this.#parametersByPosition
    )
  }
}

export class QueryInput {
  readonly text: string
  readonly parametersByName: { readonly [value: string]: unknown } | undefined
  readonly parametersByPosition: readonly unknown[] | undefined

  constructor(
    text: string,
    parametersByName?: { readonly [value: string]: unknown } | undefined | null,
    parametersByPosition?: readonly unknown[] | undefined | null
  ) {
    this.text = text
    this.parametersByName = parametersByName || undefined
    this.parametersByPosition = parametersByPosition || undefined
  }
}

export const NO_QUERY_INPUT = new QueryInput('')
