import { SqlFragments } from '../sql-classes/sql-fragments.ts'
import { SqlText } from '../sql-classes/sql-text.ts'
import type { Sql } from '../sql-classes/sql.ts'

const OPENING = new SqlText('(')
const CLOSING = new SqlText(')')

export function _fn(fn: string | Sql, ...expressions: Sql[]): Sql {
  return new SqlFragments([
    typeof fn === 'string' ? new SqlText(fn) : fn,
    OPENING,
    new SqlFragments(expressions, ', '),
    CLOSING,
  ])
}
