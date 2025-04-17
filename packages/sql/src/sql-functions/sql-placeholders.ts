import { SqlFragments } from '../sql-classes/sql-fragments.ts'
import { SqlValue } from '../sql-classes/sql-value.ts'
import type { Sql } from '../sql-classes/sql.ts'
import { sql } from './sql.ts'

declare module './sql.ts' {
  interface SqlFn {
    placeholders(placeholders: number | readonly [string, ...string[]]): Sql
  }
}

sql.placeholders = function placeholders(
  placeholders: number | readonly [string, ...string[]]
): Sql {
  const fragments: Sql[] = []

  if (typeof placeholders === 'number') {
    for (let index = 0; index < placeholders; index++) {
      fragments.push(new SqlValue(undefined, undefined))
    }
  } else {
    for (const placeholder of placeholders) {
      fragments.push(new SqlValue(placeholder, undefined))
    }
  }

  return new SqlFragments(fragments, ', ')
}
