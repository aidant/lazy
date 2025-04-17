import { SqlFragments } from '../sql-classes/sql-fragments.ts'
import { SqlText } from '../sql-classes/sql-text.ts'
import { SqlValue } from '../sql-classes/sql-value.ts'
import { Sql } from '../sql-classes/sql.ts'

export interface SqlFn {
  (strings: readonly string[], ...values: unknown[]): Sql
}

export const sql = function sql(
  strings: readonly string[],
  ...values: unknown[]
): Sql {
  const fragments: Sql[] = []

  for (let index = 0; index < strings.length; index++) {
    const string = strings[index]!

    fragments.push(new SqlText(string))

    if (index >= values.length) {
      continue
    }

    let value = values[index]

    if (value instanceof Sql) {
      fragments.push(value)
    } else {
      fragments.push(new SqlValue(undefined, value))
    }
  }

  return new SqlFragments(fragments)
} as SqlFn
