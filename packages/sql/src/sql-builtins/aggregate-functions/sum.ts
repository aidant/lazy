import { SqlDialect } from '../../sql-classes/sql-dialect.ts'
import { SqlText } from '../../sql-classes/sql-text.ts'
import type { Sql } from '../../sql-classes/sql.ts'
import { _distinct } from '../_distinct.ts'
import { _fn } from '../_fn.ts'

const SUM = new SqlText('sum')
const TOTAL = new SqlText('total')

export function sum(expression: Sql | { distinct: Sql }): Sql {
  return _fn(SUM, _distinct(expression))
}

export function total(expression: Sql | { distinct: Sql }): Sql {
  return _fn(
    new SqlDialect({
      mysql: SUM,
      postgres: SUM,
      snowflake: SUM,
      sqlite: TOTAL,
    }),
    _distinct(expression)
  )
}
