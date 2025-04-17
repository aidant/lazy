import { SqlFragments } from '../sql-classes/sql-fragments.ts'
import { SqlIdentifier } from '../sql-classes/sql-identifier.ts'
import { SqlText } from '../sql-classes/sql-text.ts'
import { Sql } from '../sql-classes/sql.ts'

declare module '../sql-classes/sql.ts' {
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
