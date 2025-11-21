import { SqlDialect } from '../../sql-classes/sql-dialect.ts'
import type { Sql } from '../../sql-classes/sql.ts'
import { _fn } from '../_fn.ts'

export function $<T>() {
  return new Proxy(
    {
      [Symbol.toPrimitive]() {
        return path
      },
    },
    {
      get(target, property, reciever) {
        return Reflect.get(target, property, reciever) || $([...(path || []), property])
      },
    }
  )
}

$()

export function json_extract(json: Sql, path: Sql): Sql {
  return new SqlDialect({
    mysql: _fn('json_extract', json, path),
    postgres: _fn('json_extract_path', json, path),
    snowflake: _fn('get_path', _fn('parse_json', json), path),
    sqlite: _fn('json_quote', _fn('json_extract', json, path)),
  })
}

export function json_extract_text(json: Sql, path: Sql): Sql {
  return new SqlDialect({
    mysql: _fn('json_unquote', _fn('json_extract', json, path)),
    postgres: _fn('json_extract_path_text', json, path),
    snowflake: _fn('json_extract_path_text', json, path),
    sqlite: _fn('json_extract', json, path),
  })
}
