export class MutableQueryInput {
  text: string = ''
  parametersByName: { [value: string]: unknown } | undefined
  parametersByPosition: unknown[] | undefined
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
