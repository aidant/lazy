import { SqlDialect } from '../../sql-classes/sql-dialect.js'
import { SqlLiteral } from '../../sql-classes/sql-literal.js'
import { SqlText } from '../../sql-classes/sql-text.ts'
import { Sql } from '../../sql-classes/sql.js'
import { _distinct } from '../_distinct.js'
import { _fn } from '../_fn.js'

const COMMA = new SqlLiteral(',')
const EMPTY = new SqlLiteral('')
const GROUP_CONCAT = new SqlText('group_concat')
const LISTAGG = new SqlText('listagg')
const STRING_AGG = new SqlText('string_agg')

export function string_agg(expression: Sql | { distinct: Sql }, delimiter?: Sql): Sql {
  return _fn(
    new SqlDialect({
      mysql: GROUP_CONCAT,
      postgres: STRING_AGG,
      snowflake: LISTAGG,
      sqlite: STRING_AGG,
    }),
    _distinct(expression),
    delimiter || COMMA
  )
}

export function group_concat(expression: Sql | { distinct: Sql }, delimiter?: Sql): Sql {
  return _fn(
    new SqlDialect({
      mysql: GROUP_CONCAT,
      postgres: STRING_AGG,
      snowflake: LISTAGG,
      sqlite: GROUP_CONCAT,
    }),
    _distinct(expression),
    delimiter || COMMA
  )
}

export function listagg(expression: Sql | { distinct: Sql }, delimiter?: Sql): Sql {
  return _fn(
    new SqlDialect({
      mysql: GROUP_CONCAT,
      postgres: STRING_AGG,
      snowflake: LISTAGG,
      sqlite: GROUP_CONCAT,
    }),
    _distinct(expression),
    delimiter || EMPTY
  )
}
