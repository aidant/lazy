import { SqlDialect } from '../../sql-classes/sql-dialect.ts'
import { SqlText } from '../../sql-classes/sql-text.ts'
import type { Sql } from '../../sql-classes/sql.ts'
import { _fn } from '../_fn.ts'

const ARRAY_AGG = new SqlText('array_agg')
const JSONB_AGG = new SqlText('jsonb_agg')
const JSONB_GROUP_ARRAY = new SqlText('jsonb_group_array')
const JSON_AGG = new SqlText('json_agg')
const JSON_ARRAYAGG = new SqlText('json_arrayagg')
const JSON_GROUP_ARRAY = new SqlText('json_group_array')

export function json_array_agg(expression: Sql): Sql {
  return _fn(
    new SqlDialect({
      mysql: JSON_ARRAYAGG,
      postgres: JSON_AGG,
      snowflake: ARRAY_AGG,
      sqlite: JSON_GROUP_ARRAY,
    }),
    expression
  )
}

export {
  json_array_agg as json_arrayagg,
  json_array_agg as json_agg,
  json_array_agg as array_agg,
  json_array_agg as json_group_array,
}

export function jsonb_array_agg(expression: Sql): Sql {
  return _fn(
    new SqlDialect({
      mysql: JSON_ARRAYAGG,
      postgres: JSONB_AGG,
      snowflake: ARRAY_AGG,
      sqlite: JSONB_GROUP_ARRAY,
    }),
    expression
  )
}

export { jsonb_array_agg as jsonb_agg, jsonb_array_agg as jsonb_group_array }
