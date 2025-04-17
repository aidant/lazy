import { SqlFragments } from '../sql-classes/sql-fragments.ts'
import { SqlIdentifier } from '../sql-classes/sql-identifier.ts'
import { SqlText } from '../sql-classes/sql-text.ts'
import { SqlValue } from '../sql-classes/sql-value.ts'
import type { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    values(
      values: readonly unknown[] | { readonly [identifier: string]: unknown }
    ): Sql
  }
}

sql.values = function values(
  values: readonly unknown[] | { readonly [identifier: string]: unknown }
): Sql {
  const fragments: Sql[] = []

  if (Array.isArray(values)) {
    for (const value of values) {
      fragments.push(new SqlValue(undefined, value))
    }
  } else {
    for (const key of Object.keys(values)) {
      const value = (values as Readonly<Record<string, unknown>>)[key]!
      fragments.push(
        new SqlFragments([
          new SqlIdentifier(key),
          new SqlText(' = '),
          new SqlValue(undefined, value),
        ])
      )
    }
  }

  return new SqlFragments(fragments, ', ')
}
