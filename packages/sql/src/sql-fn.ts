import type { SqlDialectName } from './primitives/sql-dialect-types.ts'
import { SqlDialect } from './primitives/sql-dialect.ts'
import { SqlFragments } from './primitives/sql-fragments.ts'
import { SqlIdentifier } from './primitives/sql-identifier.ts'
import { SqlPlaceholders } from './primitives/sql-placeholders.ts'
import {
  EMPTY_SQL_PRIMITIVE,
  SqlPrimitive,
} from './primitives/sql-primitive.ts'
import { SqlText } from './primitives/sql-text.ts'
import { SqlValues } from './primitives/sql-values.ts'

export function sql(
  strings: ReadonlyArray<string>,
  ...values: Array<unknown>
): SqlPrimitive {
  const fragments: SqlPrimitive[] = []

  for (let index = 0; index < strings.length; index++) {
    const string = strings[index]!

    fragments.push(new SqlText(string))

    if (index >= values.length) {
      continue
    }

    let value = values[index]

    if (value instanceof SqlPrimitive) {
      fragments.push(value)
    } else {
      fragments.push(new SqlValues([value]))
    }
  }

  return new SqlFragments(fragments)
}

sql.raw = function raw(text: string): SqlPrimitive {
  return new SqlText(text)
}

const JOIN_SEPARATOR = new Set([
  '',
  ' ',
  ',',
  ', ',
  ' and ',
  ' or ',
  ') and (',
  ') or (',
  ';',
  '; ',
])
export type JoinSeparator =
  typeof JOIN_SEPARATOR extends Set<infer T> ? T : never

sql.join = function join(
  fragments: SqlPrimitive[],
  separator: SqlPrimitive | JoinSeparator
): SqlPrimitive {
  if (typeof separator === 'string' && !JOIN_SEPARATOR.has(separator)) {
    throw new Error(
      `Unable to join sql queries, the separator "${separator}" is not included in the list of allowed separators: "${[...JOIN_SEPARATOR].join('", "')}"`
    )
  }

  return new SqlFragments(fragments, separator)
}

sql.value = function value(value: unknown): SqlPrimitive {
  return new SqlValues([value])
}

sql.values = function values(
  values: readonly unknown[] | Readonly<Record<string, unknown>>
): SqlPrimitive {
  if (Array.isArray(values)) {
    return new SqlValues(values)
  }

  const fragments: SqlPrimitive[] = []

  for (const key of Object.keys(values)) {
    const value = (values as Readonly<Record<string, unknown>>)[key]!
    fragments.push(
      new SqlFragments([
        new SqlIdentifier(key),
        new SqlText(' = '),
        value instanceof SqlPrimitive ? value : new SqlValues([value]),
      ])
    )
  }

  return new SqlFragments(fragments, ', ')
}

sql.placeholder = function placeholder(placeholder: string): SqlPrimitive {
  return new SqlPlaceholders([placeholder])
}

sql.placeholders = function placeholders(
  placeholders: readonly [string, ...string[]]
): SqlPrimitive {
  return new SqlPlaceholders(placeholders)
}

sql.identifier = function identifier(
  identifier: string | readonly [string, ...string[]]
): SqlPrimitive {
  return new SqlIdentifier(identifier)
}

sql.dialect = function dialect(
  dialects: Readonly<Record<SqlDialectName, SqlPrimitive>>
): SqlPrimitive {
  return new SqlDialect(dialects)
}

sql.sqlite = function sqlite(sql: SqlPrimitive): SqlPrimitive {
  return new SqlDialect({
    sqlite: sql,
    mysql: EMPTY_SQL_PRIMITIVE,
    postgresql: EMPTY_SQL_PRIMITIVE,
  })
}

sql.mysql = function mysql(sql: SqlPrimitive): SqlPrimitive {
  return new SqlDialect({
    sqlite: EMPTY_SQL_PRIMITIVE,
    mysql: sql,
    postgresql: EMPTY_SQL_PRIMITIVE,
  })
}

sql.postgresql = function postgresql(sql: SqlPrimitive): SqlPrimitive {
  return new SqlDialect({
    sqlite: EMPTY_SQL_PRIMITIVE,
    mysql: EMPTY_SQL_PRIMITIVE,
    postgresql: sql,
  })
}

sql.fn = new Proxy({} as Record<string, (...args: unknown[]) => SqlPrimitive>, {
  get:
    (_target, property, _receiver) =>
    (...args: unknown[]) => {
      const fragments: SqlPrimitive[] = [
        new SqlText(String(property)),
        new SqlText('('),
      ]

      if (args.length) {
        const params: SqlPrimitive[] = []

        for (const arg of args) {
          params.push(arg instanceof SqlPrimitive ? arg : new SqlValues([arg]))
        }

        fragments.push(new SqlFragments(params, ', '))
      }

      fragments.push(new SqlText(')'))

      return new SqlFragments(fragments)
    },
})
