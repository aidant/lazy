import type { Sql } from '../../sql-classes/sql.ts'
import { _fn } from '../_fn.ts'

export function min(expression: Sql): Sql {
  return _fn('min', expression)
}
