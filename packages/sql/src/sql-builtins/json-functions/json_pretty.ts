import { SqlDialect } from '../../sql-classes/sql-dialect.ts'
import { SqlLiteral } from '../../sql-classes/sql-literal.ts'
import { SqlText } from '../../sql-classes/sql-text.ts'
import type { Sql } from '../../sql-classes/sql.ts'
import { _fn } from '../_fn.ts'

const JSON_PRETTY = new SqlText('json_pretty')
const JSONB_PRETTY = new SqlText('jsonb_pretty')
const TWO_SPACES = new SqlLiteral('  ')

export function json_pretty(expression: Sql): Sql {
  return new SqlDialect({
    mysql: _fn(JSON_PRETTY, expression),
    postgres: _fn(JSONB_PRETTY, expression),
    snowflake: expression,
    sqlite: _fn(JSON_PRETTY, expression, TWO_SPACES),
  })
}

export { json_pretty as jsonb_pretty }
