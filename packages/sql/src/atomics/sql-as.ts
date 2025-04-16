import { SqlFragments } from './sql-fragments.js'
import { SqlIdentifier } from './sql-identifier.js'
import { SqlText } from './sql-text.js'
import { Sql } from './sql.ts'

declare module './sql.ts' {
  interface Sql {
    as(identifier: string | readonly [string, ...string[]]): Sql
  }
}

Sql.prototype.as = function as(
  identifier: string | readonly [string, ...string[]]
): Sql {
  return new SqlFragments([
    this,
    new SqlText(' as '),
    new SqlIdentifier(identifier),
  ])
}
