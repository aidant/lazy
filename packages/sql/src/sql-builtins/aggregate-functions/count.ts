import { SqlText } from '../../sql-classes/sql-text.ts'
import type { Sql } from '../../sql-classes/sql.ts'
import { _distinct } from '../_distinct.ts'
import { _fn } from '../_fn.ts'

export function count(expression?: '*' | Sql | { distinct: Sql }): Sql {
  if (!expression || expression === '*') {
    return new SqlText('count(*)')
  }

  return _fn('count', _distinct(expression))
}
