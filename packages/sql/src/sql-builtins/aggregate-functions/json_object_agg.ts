import { SqlDialect } from '../../sql-classes/sql-dialect.ts'
import { SqlText } from '../../sql-classes/sql-text.ts'
import type { Sql } from '../../sql-classes/sql.ts'
import { _fn } from '../_fn.ts'

const JSONB_GROUP_OBJECT = new SqlText('jsonb_group_object')
const JSONB_OBJECT_AGG = new SqlText('jsonb_object_agg')
const JSON_GROUP_OBJECT = new SqlText('json_group_object')
const JSON_OBJECTAGG = new SqlText('json_objectagg')
const JSON_OBJECT_AGG = new SqlText('json_object_agg')
const OBJECT_AGG = new SqlText('object_agg')

export function json_object_agg(expression: Sql): Sql {
  return _fn(
    new SqlDialect({
      mysql: JSON_OBJECTAGG,
      postgres: JSON_OBJECT_AGG,
      snowflake: OBJECT_AGG,
      sqlite: JSON_GROUP_OBJECT,
    }),
    expression
  )
}

export {
  json_object_agg as json_objectagg,
  json_object_agg as object_agg,
  json_object_agg as json_group_object,
}

export function jsonb_object_agg(expression: Sql): Sql {
  return _fn(
    new SqlDialect({
      mysql: JSON_OBJECTAGG,
      postgres: JSONB_OBJECT_AGG,
      snowflake: OBJECT_AGG,
      sqlite: JSONB_GROUP_OBJECT,
    }),
    expression
  )
}

export { jsonb_object_agg as jsonb_group_object }
