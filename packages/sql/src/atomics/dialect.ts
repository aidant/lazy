type Coerce<T, U> = [T] extends [never] ? U : T extends U ? T : U
export type Dialect = Coerce<
  {
    [Type in keyof Dialect.Types]: Dialect.Types[Type] extends Dialect.Type
      ? Type
      : string
  }[keyof Dialect.Types],
  string
>

export namespace Dialect {
  export interface Type {
    readonly quote: string
    readonly parameterNamePrefix: string
    readonly parameterPositional: string
  }
  export interface Types {}
}

export const DIALECTS: Dialect.Types = {} as Dialect.Types

export function configure(dialects: {
  readonly [Type in keyof Dialect.Types]?: Dialect.Types[Type] extends Dialect.Type
    ? Dialect.Types[Type]
    : never
}): void {
  const __dialects__ = dialects as Record<string, Dialect.Type>
  const __DIALECTS__ = DIALECTS as Record<string, Dialect.Type>

  for (const dialect of Object.keys(__dialects__)) {
    const __dialect__ = __dialects__[dialect]!
    const __DIALECT__ = __DIALECTS__[dialect]!

    if (!__DIALECT__) {
      __DIALECTS__[dialect] = {
        quote: __dialect__.quote,
        parameterNamePrefix: __dialect__.parameterNamePrefix,
        parameterPositional: __dialect__.parameterPositional,
      } satisfies Dialect.Type

      return
    }

    if (
      __DIALECT__.quote === __dialect__.quote &&
      __DIALECT__.parameterNamePrefix === __dialect__.parameterNamePrefix &&
      __DIALECT__.parameterPositional === __dialect__.parameterPositional
    ) {
      return
    }

    throw new Error(
      `Unable to configure dialect ${dialect}(${__dialect__.quote}, ${__dialect__.parameterNamePrefix}, ${__dialect__.parameterPositional}), the "${dialect}" dialect has already been delcared as ${dialect}(${__DIALECT__.quote}, ${__DIALECT__.parameterNamePrefix}, ${__DIALECT__.parameterPositional})`
    )
  }
}

export function dialect(dialect: Dialect): Dialect.Type {
  return DIALECTS[dialect as keyof typeof DIALECTS] as Dialect.Type
}
