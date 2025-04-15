export class Sql {
  readonly text: string
  readonly values: Readonly<Record<string, unknown>> | undefined

  constructor(
    text: string,
    values?: Readonly<Record<string, unknown>> | undefined
  ) {
    this.text = text
    this.values = values
  }
}

export const EMPTY_SQL = new Sql('')
