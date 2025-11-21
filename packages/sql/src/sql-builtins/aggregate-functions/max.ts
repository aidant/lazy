import type { Sql } from '../../sql-classes/sql.ts'
import { _fn } from '../_fn.ts'

export function max(expression: Sql): Sql {
  return _fn('max', expression)
}
