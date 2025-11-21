import type { Sql } from '../../sql-classes/sql.ts'
import { _distinct } from '../_distinct.ts'
import { _fn } from '../_fn.ts'

export function avg(expression: Sql | { distinct: Sql }): Sql {
  return _fn('avg', _distinct(expression))
}
