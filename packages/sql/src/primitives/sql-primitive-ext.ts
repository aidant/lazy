import { SqlFragments } from './sql-fragments.ts'
import { SqlIdentifier } from './sql-identifier.ts'
import { SqlPrimitive } from './sql-primitive.ts'
import { SqlText } from './sql-text.ts'

declare module './sql-primitive.ts' {
  interface SqlPrimitive {
    as(identifier: string | readonly [string, ...string[]]): SqlPrimitive
  }
}

SqlPrimitive.prototype.as = function as(
  identifier: string | readonly [string, ...string[]]
): SqlPrimitive {
  return new SqlFragments([
    this,
    new SqlText(' as '),
    new SqlIdentifier(identifier),
  ])
}
