import type { Sql } from '../mod.ts'
import { SqlFragments } from '../sql-classes/sql-fragments.ts'
import { SqlText } from '../sql-classes/sql-text.ts'

export function _distinct(expression: Sql | { distinct: Sql }): Sql {
  if ('distinct' in expression) {
    return new SqlFragments([new SqlText('distinct '), expression.distinct])
  }

  return expression
}
